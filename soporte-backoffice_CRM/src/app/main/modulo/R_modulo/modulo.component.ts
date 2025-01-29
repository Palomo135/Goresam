import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuloService } from '../modulo.service';
import { Modulo } from '../R_modulo/modulo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  descripcion: string; // Campo para agregar un módulo
  modulos: Modulo[] = []; // Lista de módulos
  estado: boolean = true;
  editModuloId: number | null = null; // Para editar un módulo específico
  submitted = false;
  isEditMode: boolean = false;

  constructor(
    public activeModal: NgbActiveModal, // Asegúrate de que NgbActiveModal esté inyectado
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    if (this.moduloId) {
      this.enableEditModulo(this.moduloId);
    }
    this.loadModulos(); // Cargar los módulos existentes al iniciar
  }

  // Cargar los módulos del curso
  loadModulos(): void {
    this.moduloService.getModulos(this.cursoId).subscribe((modulos) => {
      this.modulos = modulos;
    }, (err) => {
      console.error('Error al cargar módulos:', err);
    });
  }

  // Agregar un nuevo módulo
  addModulo(): void {
    if (this.descripcion) {
      const nuevoModulo: Modulo = {
        nombre: this.descripcion, // Asignar descripcion a nombre
        cursoId: this.cursoId || null, // Asignar el cursoId
        orden: this.modulos.length + 1, // Orden automático
        estado: this.estado ?? true
      };
      this.moduloService.createModulo(nuevoModulo).subscribe((modulo) => {
        this.modulos.push(modulo);
        this.resetForm();
        this.loadModulos(); // Recargar lista de módulos
        this.activeModal.dismiss();
      });
      console.log(nuevoModulo);
    }
  }

  stripHtmlTags(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.textContent || div.innerText || ''; // Retorna solo el texto
  }

  // Habilitar edición de un módulo
  enableEditModulo(id: number): void {
    const modulo = this.modulos.find(m => m.id === id);
    if (modulo) {
      this.editModuloId = modulo.id;
      this.descripcion = modulo.nombre; // Asignar nombre a descripcion
    }
  }

  // Actualizar un módulo
  updateModulo(): void {
    if (this.editModuloId !== null && this.descripcion) {
      const updatedModulo: Modulo = {
        id: this.editModuloId,
        nombre: this.descripcion,
        cursoId: this.cursoId,
        orden: this.modulos.find(m => m.id === this.editModuloId)?.orden || 0, // Mantener el orden existente
        estado: true
      };
      this.moduloService.updateModulo(updatedModulo).subscribe(() => {
        const index = this.modulos.findIndex(m => m.id === this.editModuloId);
        if (index !== -1) {
          this.modulos[index] = updatedModulo;
        }
        this.resetForm();
        this.loadModulos(); // Recargar lista de módulos
        this.activeModal.dismiss();
      });
    }
  }

  // Restablecer el formulario
  resetForm(): void {
    this.descripcion = '';
    this.cursoId = null;
    this.estado = true;
    this.editModuloId = null;
    this.submitted = false;
  }

  // Cerrar el modal
  closeModal(): void {
    this.activeModal.close();
  }
}