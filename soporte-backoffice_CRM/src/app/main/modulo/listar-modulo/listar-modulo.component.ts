import { ModuloService } from './../modulo.service';
import { Component, OnInit } from '@angular/core';
import { Modulo } from '../R_modulo/modulo';
import { ModuloList } from '../R_modulo/moduloList';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-modulo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-modulo.component.html',
  styleUrls: ['./listar-modulo.component.scss']
})
export class ListarModuloComponent implements OnInit {

  moduloList: ModuloList[] = [];
  //modulos: Modulo[] = [];


  constructor(private moduloService: ModuloService) { }

  ngOnInit(): void {
    // this.moduloService.getTodosModulos.subscribe((modulos) => {
    //   this.modulos = modulos;
    // });
    // Obtener todos los módulos al iniciar el componente
    this.moduloService.getModulosLista().subscribe(
      (modulos) => {
        this.moduloList = modulos;
        console.log('Módulos cargados:', this.moduloList);
      },
      (error) => {
        console.error('Error al cargar los módulos:', error);
      }
    );
  }

}
