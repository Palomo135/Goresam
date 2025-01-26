import { ModuloService } from './../../modulo/modulo.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClausulaService } from '../clausula.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { callbackify } from 'util';
import { Clausula } from './clausula';
import { Modulo } from 'app/main/modulo/R_modulo/modulo';
import { id } from '@swimlane/ngx-datatable';

declare var $: any;

@Component({
  selector: 'app-r-clausula',
  templateUrl: './r-clausula.component.html',
  styleUrls: ['./r-clausula.component.scss']
})
export class RClausulaComponent implements OnInit {
  @Input() clausula: Clausula | null = null;
  @Input() moduleId: Modulo;
  clausulaForm: FormGroup;
  modulos: any[] = [];

  constructor(private fb: FormBuilder, private clausulaService: ClausulaService, private moduloService: ModuloService,
    public activeModal: NgbActiveModal
  ) {
    this.clausulaForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      moduloId: ['', Validators.required],
      estado: [true, Validators.required]
    })
  }

  ngOnInit(): void {
    this.clausulaForm.patchValue({ moduleId: this.moduleId }),
      this.openModulos()
    if (this.clausula) {
      this.clausulaForm.patchValue(this.clausula);

      // Cargar contenido en Summernote
      setTimeout(() => {
        $('#summernote').summernote('code', this.clausula.descripcion);
      }, 0);
    }
  }

  ngAfterViewInit() {
    $('#summernote').summernote({
      placeholder: 'Escribe aquí...',
      tabsize: 2,
      height: 300,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'italic', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'video']],
        ['view', ['fullscreen', 'codeview', 'help']]
      ],
      callbacks: {
        onChange: (contents: string) => {
          this.clausulaForm.get('descripcion')?.setValue(contents);
        }
      }
    });
    // Si ya hay una descripción prellenada, inicializa Summernote con su contenido
    const initialDescripcion = this.clausulaForm.get('descripcion')?.value;
    if (initialDescripcion) {
      $('#summernote').summernote('code', initialDescripcion);
    }
  }

  openModulos(): void {
    this.moduloService.getTodosModulos().subscribe({
      next: (modulos) => {
        this.modulos = modulos; // Asignar los módulos a la variable
      },
      error: (err) => {
        console.error('Error al cargar módulos:', err);
      },
    });
  }

  // onSubmit(): void {
  //   if (this.clausulaForm.invalid) {
  //     return;
  //   }
  //   this.clausulaService.createClausula(this.clausulaForm.value).subscribe({
  //     next: () => {
  //       Swal.fire('Registrado', 'El curso ha sido registrado.', 'success');
  //       this.clausulaForm.reset(); // Limpia el formulario
  //       $('#summernote').summernote('reset'); // Limpia Summernote
  //     },
  //     error: () => Swal.fire('Error', 'No se pudo registrar el curso.', 'error')
  //   });
  // }

  // onSubmit(): void {
  //   if (this.clausulaForm.invalid) {
  //     return;
  //   }

  //   // Obtén el contenido de la descripción desde el formulario
  //   const descripcionHtml = this.clausulaForm.get('descripcion')?.value;

  //   // Convierte el contenido HTML en texto plano (elimina etiquetas HTML)
  //   const descripcionTextoPlano = $('<div>').html(descripcionHtml).text();

  //   // Crea el objeto con los datos del formulario, sobrescribiendo la descripción
  //   const clausulaData = {
  //     ...this.clausulaForm.value,
  //     descripcion: descripcionTextoPlano,
  //   };

  //   // Enviar los datos al servicio
  //   this.clausulaService.createClausula(clausulaData).subscribe({
  //     next: () => {
  //       Swal.fire('Registrado', 'La cláusula ha sido registrada.', 'success');
  //       this.clausulaForm.reset(); // Limpia el formulario
  //       $('#summernote').summernote('reset'); // Resetea Summernote
  //     },
  //     error: () =>
  //       Swal.fire('Error', 'No se pudo registrar la cláusula.', 'error'),
  //   });
  // }

  onSubmit(): void {
    if (this.clausulaForm.invalid) {
      return;
    }

    const clausulaData = {
      ...this.clausulaForm.value,
      descripcion: $('<div>').html(this.clausulaForm.get('descripcion')?.value).text() // Limpiar HTML
    };

    // Si hay un ID, se actualiza; si no, se crea
    if (clausulaData.id) {
      this.clausulaService.updateClausula(clausulaData.id, clausulaData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'La cláusula ha sido actualizada.', 'success');
          this.activeModal.close(); // Cierra el modal
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la cláusula.', 'error')
      });
    } else {
      this.clausulaService.createClausula(clausulaData).subscribe({
        next: () => {
          Swal.fire('Registrado', 'La cláusula ha sido registrada.', 'success');
          this.activeModal.close(); // Cierra el modal
        },
        error: () => Swal.fire('Error', 'No se pudo registrar la cláusula.', 'error')
      });
    }
  }
}
