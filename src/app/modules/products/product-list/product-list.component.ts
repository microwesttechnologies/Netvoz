import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  QueryList,
  ViewChildren,
  HostListener,
} from "@angular/core";
import { ProductService } from "../../../core/service/product.service";
import { UmedidaService } from "../../../core/service/umedida.service";
import { CategoriaService } from "../../../core/service/categoria.service";
import { Product } from "../../../Data/models/product";
import { Umedida } from "../../../Data/models/um";
import { Categoria } from "../../../Data/models/categoria";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProductEditComponent } from "../product-edit/product-edit.component";
import { ProductsExcelimportComponent } from "../products-excelimport/products-excelimport.component";
import { ProductCreateComponent } from "../product-create/product-create.component";
import { DecimalPipe } from "@angular/common";
import { AlertService } from "../../../core/service/alert.service";
import { TableUtil } from "../../../helpers/tableUtil";
import AOS from "aos";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  providers: [ProductService, DecimalPipe],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  product: Product;
  products: Product[];
  categorias: Categoria[];
  umedidas: Umedida[];

  statusCode: number;
  public dataSource = new MatTableDataSource<Product>();
  screenHeight: any;
  screenWidth: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.setDisplayedColumns();
  }

  constructor(
    private router: Router,
    public repoService: ProductService,
    public cat_service: CategoriaService,
    public um_service: UmedidaService,
    public alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.screenHeight = window.screen.height;
    this.screenWidth = window.screen.width;
    this.setDisplayedColumns();
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategorias();
    this.getAllUmedidas();
    AOS.init();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getAllProducts() {
    const data = JSON.parse(localStorage.getItem("userinfo"));
    let idempresa: any;
    if (data && data.USU_EmpresasUsuarios) {
      idempresa = data.USU_EmpresasUsuarios[0].Codigo;

      this.repoService
        .getAllProducts$(`PRO_Productos/GetAllProductosEmpresa/${idempresa}`)
        .subscribe(
          (data) => (this.dataSource.data = data),
          (errorCode) => {
            //this.alertService.showError(errorCode.message, 'Error en autenticación');
          }
        );
    }
  }

  newProducto(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "550px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      categorias: this.categorias,
      umedidas: this.umedidas,
    };
    const dialogRef = this.dialog.open(ProductCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.repoService
        .createProduct(result)
        .subscribe((_) => this.getAllProducts());
    });
  }

  editProducto(id: number): void {
    this.repoService
      .getProductByCode$(`PRO_Productos/${id}`)
      .subscribe((data) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = "550px";
        dialogConfig.width = "600px";
        dialogConfig.data = {
          producto: data,
          categorias: this.categorias,
          umedidas: this.umedidas,
        };
        const dialogRef = this.dialog.open(ProductEditComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((result) => {
          if (!result) {
            return;
          }
          this.repoService
            .updateProduct$(result, `PRO_Productos/ActualizarProducto`)
            .subscribe((_) => this.getAllProducts());
        });
      });
  }

  deleteproducto(producto: Product) {
    this.repoService.deleteProductByCod(producto.PRO_Id).subscribe(
      (data) => {
        if (data.CodeMensaje === 8) {
          this.alertService.opensweetalert(
            "info",
            "Advertencia",
            "El producto ya tiene ordenes."
          );
        } else if (data.CodeMensaje === 3) {
          this.alertService.opensweetalert(
            "success",
            "",
            "Producto eliminado."
          );
          this.getAllProducts();
        }
      },
      (errorCode) => {
        this.alertService.opensweetalert(
          "Error",
          "Error",
          "Ocurrío un error al eliminar el producto"
        );
      }
    );
  }

  getAllCategorias() {
    this.cat_service.getAllcategorias$("CAT_Categorias").subscribe(
      (data) => (this.categorias = data),
      (errorCode) => (this.statusCode = errorCode)
    );
  }

  getAllUmedidas() {
    this.um_service
      .getAllUm$("PRO_Productos/ConsultarUnidadesMedida")
      .subscribe(
        (data) => (this.umedidas = data),
        (errorCode) => (this.statusCode = errorCode)
      );
  }

  onChangeEstado(PRO_Estado, PRO_Id) {
    let jsonpro = { idProducto: PRO_Id, estado: PRO_Estado };
    this.repoService
      .updateStateProduct$(`PRO_Productos/ActualizarEstadoProducto`, jsonpro)
      .subscribe((_) => this.getAllProducts());
  }

  public redirectToUpdate = (id: string) => {
    this.router.navigate([`products/${id}/edit`]);
  };

  public redirectToDetails = (id: string) => {};

  exportArray() {
    const errorArray: any[] = this.dataSource.data.map((x) => ({
      Código: x.PRO_Codigo,
      Nombre: x.PRO_Nombre,
      Descripción: x.PRO_Descripcion,
      Precio: x.PRO_PrecioUnidad,
      Marca: x.PRO_Marca,
      UM: x.UME_UnidadesMedidaUME_Nombre,
      Tamaño: x.PRO_Tamano,
      Estado: x.PRO_Estado,
      Categoría: x.CAT_CategoriasCAT_Nombre,
    }));
    TableUtil.exportArrayToExcel(errorArray, "Productos");
  }

  redirectToImportExcel() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = "600px";
    dialogConfig.width = "600px";
    dialogConfig.panelClass = "my-dialog";
    const dialogRef = this.dialog.open(
      ProductsExcelimportComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.repoService
        .updateProduct$(result, `PRO_Productos/ActualizarProducto`)
        .subscribe((_) => this.getAllProducts());
    });
  }

  public redirectToDelete = (id: string) => {};

  /**
   * Update a list of table columns to be displayed based on the width of the screen.
   */
  setDisplayedColumns() {
    if (this.screenWidth < 420) {
      this.displayedColumns = [
        "PRO_Codigo",
        "PRO_Nombre",
        "PRO_PrecioUnidad",
        "action",
      ];
    } else if (this.screenWidth >= 420 && this.screenWidth <= 800) {
      this.displayedColumns = [
        "PRO_Codigo",
        "PRO_Nombre",
        "PRO_PrecioUnidad",
        "PRO_Marca",
        "PRO_Estado",
        "action",
      ];
    } else {
      this.displayedColumns = [
        "PRO_Codigo",
        "PRO_Nombre",
        "PRO_Descripcion",
        "PRO_PrecioUnidad",
        "UME_UnidadesMedidaUME_Nombre",
        "PRO_Tamano",
        "CAT_CategoriasCAT_Nombre",
        "PRO_Marca",
        "PRO_Estado",
        "action",
      ];
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
}
