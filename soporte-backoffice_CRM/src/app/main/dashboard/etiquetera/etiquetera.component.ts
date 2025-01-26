import { CourseSharedService } from '../service/course-shared.service';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, } from '@angular/core';
import { EtiqueteraService } from '../service/etiquetera.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Para usar el modal
import { Curso } from './curso';
import { CursoEdit } from './cursoEdit';

declare var $: any;

@Component({
  selector: 'app-etiquetera',
  templateUrl: './etiquetera.component.html',
  styleUrls: ['./etiquetera.component.scss']
})
export class EtiqueteraComponent implements OnInit, AfterViewInit
//OnChanges 
{

  @Input() courseToEdit: CursoEdit | null = null;
  cursoToEdit: Curso | null = null; // Recibe el curso para editar

  cursoForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  newKeyword: string = '';
  keywords: string[] = [];

  constructor(
    private courseSharedService: CourseSharedService,
    private etiqueteraService: EtiqueteraService,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      logo: [null, Validators.required],
      recurso: ['', Validators.required],
      estado: [true, Validators.required],
      frase: [''],
      dirigido: [''],
      aprendizaje: [''],
      requisitos: [''],
      reconocimiento: ['']
    });
  }

  ngOnInit(): void {
    this.courseSharedService.course$.subscribe((course) => {
      if (course) {

        this.cursoForm.patchValue({
          nombre: course.nombre,
          descripcion: course.descripcion,
          recurso: course.recurso, // Cargar el URL
          estado: course.estado, // Cargar el estado
        });

        if (course.logo) {
          this.logoPreview = `http://localhost:3200/api/curso/logo/${course.id}`;
        }

        // Cargamos las palabras clave
        if (course.detallePalabrasClave) {
          this.keywords = course.detallePalabrasClave.map((p) => p.nombre)
        }

        // Mandamos la id del curso al formulario
        if (!this.cursoForm.contains('id')) {
          this.cursoForm.addControl('id', this.fb.control(course.id));
        }

        // Iniciamos la descripción en el formulario summernote
        $('#summernote').summernote('code', course.descripcion || '')
        if (this.cursoForm.get('id')?.value) {
          this.cursoForm.get('logo')?.clearValidators();
          this.cursoForm.get('logo')?.updateValueAndValidity();
        }
      }
    });
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
        ['insert', ['link', 'video']], // Mantiene link y video, elimina picture
        ['view', ['fullscreen', 'codeview', 'help']]
      ],
      callbacks: {
        onChange: (contents: string) => {
          this.cursoForm.patchValue({ descripcion: contents });
          this.cursoForm.markAsDirty();
        }
      }
    });
  }


  addKeyword(): void {
    if (this.newKeyword && !this.keywords.includes(this.newKeyword)) {
      this.keywords.push(this.newKeyword);
      this.newKeyword = '';
    }
    else {
      Swal.fire('Error', 'La palabraclave ya existe o es invalida', 'error')
    }
  }

  removeKeyword(index: number): void {
    this.keywords.splice(index, 1);
  }

  onSubmit(): void {
    const descripcion = $('#summernote').summernote('code');
    this.cursoForm.patchValue({ descripcion });

    const formData = new FormData();

    // Agregar todos los campos al FormData
    Object.keys(this.cursoForm.value).forEach(key => {
      if (key === 'logo') {
        // Solo agregar el logo si hay un nuevo archivo
        const fileInput = this.cursoForm.get('logo')?.value;
        if (fileInput instanceof File) {
          formData.append('logo', fileInput);
        }
      } else {
        formData.append(key, this.cursoForm.get(key)?.value);
      }
    });

    // Agregar palabras clave
    if (this.keywords && this.keywords.length > -1) {
      // Convertir el array de palabras clave al formato esperado
      const palabrasClaveFormateadas = this.keywords.map(keyword => ({ nombre: keyword }));
      formData.append('detallePalabraClave', JSON.stringify(palabrasClaveFormateadas));
    }

    const cursoId = this.cursoForm.get('id')?.value
    if (cursoId) {
      // Si estamos editando, enviamos el ID en el formData
      formData.append('id', cursoId);

      this.etiqueteraService.updateCourse(cursoId, formData)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El curso ha sido actualizado.', 'success');
            this.resetForm();
            this.closeModal();
          },
          error: () => {
            Swal.fire('Error', 'Ha ocurrido un error al actualizar el curso.', 'error');
          },
        });
    } else {
      this.etiqueteraService.createCourse(formData).subscribe({
        next: () => {
          Swal.fire('Registrado', 'El curso ha sido registrado.', 'success');
          this.resetForm();
          this.closeModal();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el curso.', 'error');
        },
      });
    }
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.logoPreview = reader.result as string; // Guarda la base64
      };
      reader.readAsDataURL(file); // Convierte el archivo a base64
      this.cursoForm.patchValue({ logo: file });
    }
  }

  ngOnDestroy(): void {
    if (this.logoPreview && typeof this.logoPreview === 'string') {
      URL.revokeObjectURL(this.logoPreview);
    }
  }

  resetForm(): void {
    this.cursoForm.reset();
    this.cursoForm.markAsPristine();
    this.cursoForm.markAsUntouched();
    this.keywords = [];
    this.logoPreview = null;
    $('#summernote').summernote('reset');
  }

  //cerrar modal
  closeModal(): void {
    this.modalService.dismissAll();
  }

}
