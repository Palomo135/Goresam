import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuloService } from '../modulo.service';
import { Modulo } from '../R_modulo/modulo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modulo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
})
export class ModuloComponent implements OnInit {
  @Input() cursoId: number | null = null; // ID del curso asociado
  @Input() moduloId: number | null = null; // Nombre del curso asociado
  //cursoId: number | null = null; // ID del curso asociado
  titulo: string;
  descripcion: string; // Campo para agregar un módulo
  modulos: Modulo[] = []; // Lista de módulos
  estado: boolean = true;
  editModuloId: number | null = null; // Para editar un módulo específico
  submitted = false;
  isEditMode: boolean = false;
  orden: number | null = null;
  wordLimitExceeded: boolean = false;

  constructor(
    public activeModal: NgbActiveModal, // Asegúrate de que NgbActiveModal esté inyectado
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    if (this.moduloId) {
      console.log(this.moduloId);
      this.enableEditModulo(this.moduloId);
    }
  }

  // Agregar un nuevo módulo
  addModulo(): void {
    this.submitted = true;
    if (this.titulo && this.descripcion && !this.wordLimitExceeded) {
      const nuevoModulo: Modulo = {
        nombre: this.titulo, // Asignar descripcion a nombre
        descripcion: this.descripcion,
        cursoId: this.cursoId || null, // Asignar el cursoId
        orden: this.modulos.length + 1, // Orden automático
        estado: this.estado ?? true
      };
      this.moduloService.createModulo(nuevoModulo).subscribe((modulo) => {
        Swal.fire('Modulo registrado', 'El módulo ha sido registrado correctamente', 'success');
        this.modulos.push(modulo);
        this.resetForm();
        this.activeModal.dismiss();
      });
      console.log(nuevoModulo);
    }
  }

  // Habilitar edición de un módulo
  enableEditModulo(id: number): void {
    console.log('id recibido: ', id);
    this.moduloService.getModulosLista().subscribe((modulos) => {
      const modulo = modulos.filter(modulo => modulo.id === id);
      console.log('modulo encontrado: ', modulo);
      if (modulo.length > 0) {
        this.editModuloId = modulo[0].id;
        this.titulo = modulo[0].nombre; // Asignar nombre a titulo
        this.descripcion = modulo[0].descripcion;
        // this.estado = modulo[0].estado;
        // this.cursoId = modulo[0].curso.id;
        this.orden = modulo[0].orden;
        this.isEditMode = true;
      }
    });
    // const modulo = this.modulos.find(m => m.id === id);
    // console.log('modulo encontrado: ', modulo);
    // if (modulo) {
    //   this.editModuloId = modulo.id;
    //   this.descripcion = modulo.nombre; // Asignar nombre a descripcion
    // }
  }

  // Actualizar un módulo
  updateModulo(): void {
    if (this.editModuloId !== null && this.descripcion && !this.wordLimitExceeded) {
      const updatedModulo: Modulo = {
        id: this.editModuloId,
        nombre: this.titulo,
        descripcion: this.descripcion,
        cursoId: this.cursoId,
        orden: this.modulos.find(m => m.id === this.editModuloId)?.orden || 0, // Mantener el orden existente
        estado: this.estado ?? true
      };
      console.log('Modulo actualizado:', updatedModulo);
      this.moduloService.updateModulo(updatedModulo).subscribe(() => {
        const index = this.modulos.findIndex(m => m.id === this.editModuloId);
        if (index !== -1) {
          this.modulos[index] = updatedModulo;
        }
        Swal.fire('Modulo actualizado', 'El módulo ha sido actualizado correctamente', 'success');
        this.resetForm();
        this.activeModal.dismiss();
      });
    }
  }

  // Restablecer el formulario
  resetForm(): void {
    this.titulo = '';
    this.descripcion = '';
    this.cursoId = null;
    this.estado = true;
    this.editModuloId = null;
    this.submitted = false;
    this.wordLimitExceeded = false;
  }

  // Cerrar el modal
  closeModal(): void {
    this.activeModal.close();
  }

  checkWordLimit(): void {
    const wordCount = this.descripcion ? this.descripcion.split(/\s+/).length : 0;
    this.wordLimitExceeded = wordCount > 100;
  }
} 