import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModuloService } from '../modulo.service';
import { Modulo } from '../R_modulo/modulo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-modulo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modulo.component.html',
  styleUrls: ['./modulo.component.scss'],
})
export class ModuloComponent implements OnInit {
  @Input() cursoId: number | null = null; // ID del curso asociado
  //cursoId: number | null = null; // ID del curso asociado
  descripcion: string = ''; // Campo para agregar un módulo
  modulos: Modulo[] = []; // Lista de módulos
  estado: boolean = true;
  editModuloId: number | null = null; // Para editar un módulo específico
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal, // Asegúrate de que NgbActiveModal esté inyectado
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    this.loadModulos(); // Cargar los módulos existentes al iniciar
  }

  // Cargar los módulos del curso
  loadModulos(): void {
    // if (this.cursoId) {
    //   this.moduloService.getModulos(this.cursoId).subscribe((modulos) => {
    //     this.modulos = modulos;
    //   }, (err) => {
    //     console.error('Error al cargar módulos:', err);
    //   });
    // }
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
        nombre: this.stripHtmlTags(this.descripcion), // Asignar descripcion a nombre
        cursoId: this.cursoId || null, // Asignar el cursoId
        orden: this.modulos.length + 1, // Orden automático
        estado: this.estado ?? true
      };
      this.moduloService.createModulo(nuevoModulo).subscribe((modulo) => {
        this.modulos.push(modulo);
        this.resetForm();
        this.loadModulos(); // Recargar lista de módulos
      });
      console.log(nuevoModulo);
    }
  }

  stripHtmlTags(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.textContent || div.innerText || ''; // Retorna solo el texto
  }

  ngAfterViewInit(): void {
    // Inicializar Summernote
    ($('.summernote') as any).summernote({
      placeholder: 'Escribe aquí la descripción del módulo...',
      tabsize: 2,
      height: 200,
      callbacks: {
        onChange: (contents: string) => {
          this.descripcion = contents; // Sincronizar con el modelo
        }
      }
    });
  }

  // Habilitar edición de un módulo
  enableEditModulo(id: number): void {
    const modulo = this.modulos.find(m => m.id === id);
    if (modulo) {
      this.editModuloId = modulo.id;
      this.descripcion = modulo.nombre; // Asignar nombre a descripcion
      ($('.summernote') as any).summernote('code', this.descripcion);
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
      });
    }
  }

  // Eliminar un módulo
  removeModulo(id: number): void {
    this.moduloService.deleteModulo(id).subscribe(() => {
      this.modulos = this.modulos.filter(m => m.id !== id);
      this.loadModulos(); // Recargar lista de módulos
    });
  }

  // Restablecer el formulario
  resetForm(): void {
    this.descripcion = '';
    this.cursoId = null;
    this.estado = true;
    ($('.summernote') as any).summernote('reset');
  }

  // Cerrar el modal
  closeModal(): void {
    this.activeModal.close();
  }
}