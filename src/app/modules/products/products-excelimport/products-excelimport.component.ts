import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  QueryList,
  ViewChildren,
  HostListener,
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { Product } from "../../../Data/models/product";
import { ProductService } from "../../../core/service/product.service";
import * as XLSX from "xlsx";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AlertService } from "../../../core/service/alert.service";
import { MatTableDataSource } from "@angular/material/table";
import { ChangeDetectorRef } from "@angular/core";
import { TableUtil } from "../../../helpers/tableUtil";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: "app-products-excelimport",
  templateUrl: "./products-excelimport.component.html",
  styleUrls: ["./products-excelimport.component.scss"],
})
export class ProductsExcelimportComponent implements OnInit {
  @ViewChild("fileInput") fileInput;
  progress: number = 0;
  willDownload = false;
  message: string;
  allProducts: Observable<Product[]>;
  public dataSource = new MatTableDataSource<Product>();
  dataSendExcel = [];
  counProducts: number = 0;
  error: string;
  uploadResponse = { status: "", message: "", filePath: "" };
  form: FormGroup;

  displayedColumns: string[];
  screenHeight: any;
  screenWidth: any;
  uploadFile: boolean;
  fileChenage: boolean;

  color = "primary"; //Mat Spinner Variable (Resumable)
  mode = "determinate"; //Mat Spinner Variable (Resumable)
  value = 10; //Mat Spinner Variable (Resumable)

  @HostListener("window:resize", ["$event"])
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.setDisplayedColumns();
  }

  constructor(
    private service: ProductService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private dialogRef: MatDialogRef<ProductsExcelimportComponent>,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.uploadFile = false;
    this.setDisplayedColumns();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  showProductsLoad() {
    this.allProducts = this.service.showProductsLoad("/ProductsUpload");
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    if (!this.validateFile(file?.name)) {
      this.alertService.opensweetalert(
        "error",
        "Archivo no valido",
        "Por favor verifique el formato del archivo XLSX o XLS"
      );
      return false;
    }

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: "binary" });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        this.counProducts = initial[name].length;
        return initial;
      }, {});

      this.dataSendExcel = jsonData;
      this.fileChenage = true;
    };
    reader.readAsBinaryString(file);
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf(".") + 1);
    if (ext.toLowerCase() == "xlsx" || ext.toLowerCase() == "xls") {
      return true;
    } else {
      return false;
    }
  }

  uploadFileJson1() {
    if (this.fileChenage) {
      this.ngxService.start();
      const idempresa = JSON.parse(localStorage.getItem("userinfo"))
        .USU_EmpresasUsuarios[0].Codigo;

      const sendData = [];
      Object.keys(this.dataSendExcel).forEach((key) =>
        this.dataSendExcel[key].forEach((producto) => {
          producto.EMP_Id = idempresa;
          producto.PRO_ImgProducto =
            producto.PRO_ImgProducto === "" || !producto.PRO_ImgProducto
              ? "sin_imagen.png"
              : producto.PRO_ImgProducto;
          sendData.push(producto);
        })
      );

      this.service
        .upload(sendData, "PRO_Productos/ActualizarProductosMasivo")
        .subscribe((event: HttpEvent<any>) => {
          switch (event.type) {
            case HttpEventType.Sent:
              //console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              //console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              //console.log(event.loaded);
              //console.log(event.total);
              this.progress = Math.round((event.loaded / event.total) * 100);
              //console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              if (!event.body.IsSuccess) {
                this.alertService.opensweetalert(
                  "error",
                  "Error al cargar productos",
                  "Los productos no se pudieron cargar, por favor revise el log y corrige los errores"
                );
                this.dataSource.data = event.body.Data;
                this.ref.detectChanges();
              } else {
                this.alertService.opensweetalert(
                  "success",
                  "Carga de productos",
                  "Los productos se cargaron correctamente"
                );
                this.fileChenage = false;
                this.dialogRef.close(true);

                this.ref.detectChanges();
              }

              setTimeout(() => {
                this.progress = 0;
              }, 1500);
            default:
              return `Unhandled event: ${event.type}`;
          }
          this.ngxService.stop();
        });
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  exportTable() {
    TableUtil.exportTableToExcel("tblErrors");
  }

  exportArray() {
    const errorArray: Partial<Product>[] = this.dataSource.data.map((x) => ({
      PRO_Codigo: x.PRO_Codigo,
      PRO_Nombre: x.PRO_Nombre,
      PRO_MensajeError: x.PRO_MensajeError,
    }));
    TableUtil.exportArrayToExcel(errorArray, "Errores");
  }

  close() {
    this.dialogRef.close(null);
  }

  setDisplayedColumns() {
    if (this.screenWidth < 420) {
      this.displayedColumns = ["PRO_Nombre", "PRO_MensajeError"];
    } else if (this.screenWidth >= 420 && this.screenWidth <= 800) {
      this.displayedColumns = ["PRO_Codigo", "PRO_Nombre", "PRO_MensajeError"];
    } else {
      this.displayedColumns = ["PRO_Codigo", "PRO_Nombre", "PRO_MensajeError"];
    }
  }

  /*    uploadFileJson() {
      this.service.upload(this.dataString, 'UploadProducts').subscribe(result => {
      this.message = result.toString();
      this.showProductsLoad();

    });
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
  }


  uploadFile() {
    let formData = new FormData();
    formData.append('upload', this.fileInput.nativeElement.files[0])
       this.service.UploadExcel(formData, '/UploadProducts').subscribe(result => {
      this.message = result.toString();
      this.showProductsLoad();
    });
  }
 */
}
