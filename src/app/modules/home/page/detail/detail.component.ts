import { Component, ViewChild, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Orden } from '../../../../Data/models/orden';
import { TableUtil } from '../../../../helpers/tableUtil';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Orden>();
  displayedColumns: string[];
  screenHeight: any;
  screenWidth: any;
  titulo: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @HostListener('window:resize', ['$event'])

  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    this.setDisplayedColumns();
  }

  constructor() {
    this.screenHeight = window.screen.height;
    this.screenWidth = window.screen.width;
    this.dataSource.data = history.state.data ? history.state.data : [];
    this.titulo = history.state.titulo;
    this.setDisplayedColumns();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  exportArray() {
    const errorArray: Partial<Orden>[] = this.dataSource.data.map(x => ({
      ORD_Id: x.ORD_Id,
      ORD_FechaOrden: x.ORD_FechaOrden,
      ORD_Descripcion: x.ORD_Descripcion
    }));
    TableUtil.exportArrayToExcel(errorArray, 'Pedidos');
  }

  setDisplayedColumns() {
    if (this.screenWidth < 420) {
      this.displayedColumns = ['ORD_FechaOrden', 'USU_NombreCompleto', 'ORD_ValorOrden'];
    } else if (this.screenWidth >= 420 && this.screenWidth <= 800) {
      this.displayedColumns = ['ORD_Id', 'ORD_FechaOrden', 'USU_NombreCompleto', 'ORD_ValorOrden'];
    } else {
      this.displayedColumns = ['ORD_Id', 'ORD_FechaOrden', 'USU_NombreCompleto', 'ORD_ValorOrden', 'EOR_EstadosOrdenesEOR_Nombre'];
    }
  }

  close() {
    // this.dialogRef.close(this.uploadFile);
  }

}
