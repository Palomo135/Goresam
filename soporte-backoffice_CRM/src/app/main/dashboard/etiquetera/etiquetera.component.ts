import { CourseSharedService } from '../service/course-shared.service';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, } from '@angular/core';
import { EtiqueteraService } from '../service/etiquetera.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; // Para usar el modal
import { Encargado } from '../Encargado/encargado';
import { CursoEdit } from './cursoEdit';
import { EncargadoService } from '../Encargado/encargado.service';
import { Curso } from './curso';
import { error } from 'console';
import { id, selectRows } from '@swimlane/ngx-datatable';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-etiquetera',
  templateUrl: './etiquetera.component.html',
  styleUrls: ['./etiquetera.component.scss']
})
export class EtiqueteraComponent implements OnInit, AfterViewInit {

  @Input() courseToEdit: CursoEdit | null = null;
  //cursoToEdit: Curso | null = null; // Recibe el curso para editar

  encargadoForm: FormGroup;
  encargados: Encargado[] = [];
  encargadoImagePreview: string;

  cursoForm: FormGroup;
  logoPreview: string | ArrayBuffer | null = null;
  newKeyword: string = '';
  keywords: string[] = [];
  submitted: boolean = false;
  loading: boolean = false;

  private encargadoModalRef: NgbModalRef | undefined;

  @ViewChild('encargadoModal', { static: false }) encargadoModal: any;
  //@ViewChild('cursoModal', { static: false }) cursoModal: any;

  constructor(
    private courseSharedService: CourseSharedService,
    private etiqueteraService: EtiqueteraService,
    private encargadoService: EncargadoService,
    private fb: FormBuilder,
    private modalService: NgbModal) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      logo: [true, Validators.required],
      recurso: ['', Validators.required],
      estado: [Boolean, Validators.required],
      fechaInicio: ['', Validators.required],
      fechaCaducidad: ['', Validators.required],
      encargado: [null, Validators.required],
      frase: [''],
      dirigido: [''],
      aprendizaje: [''],
      requisitos: [''],
      reconocimiento: ['']
    });

    this.encargadoForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      imagen: ['']
    });

  }

  ngOnInit(): void {
    this.loadEncargados();
    this.courseSharedService.course$.subscribe((course) => {
      if (course) {
        this.setFormValues(course);
      } else if (this.courseToEdit) {
        this.setFormValues(this.courseToEdit);
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

  setFormValues(course: CursoEdit): void {
    this.cursoForm.patchValue({
      id: course.id,
      nombre: course.nombre,
      descripcion: course.descripcion,
      recurso: course.recurso,
      logo: course.logo,
      estado: course.estado ? true : false,
      fechaInicio: this.formatDate(course.fechaInicio),
      fechaCaducidad: this.formatDate(course.fechaCaducidad),
      encargado: course.encargado ? course.encargado.id : null
    });

    if (course.logo) {
      this.logoPreview = `http://localhost:3200/api/curso/logo/${course.id}`;
    }

    this.keywords = course.detallePalabrasClave?.map(k => k.nombre) || [];
    $('#summernote').summernote('code', course.descripcion || '');

    if (!this.cursoForm.contains('id')) {
      this.cursoForm.addControl('id', this.fb.control(course.id));
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  } // Formatea la fecha


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

    this.cursoForm.patchValue({ estado: this.cursoForm.get('estado')?.value === true });

    const fechaInicio = this.cursoForm.get('fechaInicio')?.value;
    const fechaCaducidad = this.cursoForm.get('fechaCaducidad')?.value;

    if (fechaInicio && fechaCaducidad) {
      const start = moment(fechaInicio);
      const end = moment(fechaCaducidad);

      if (end.isBefore(start)) {
        Swal.fire('Error', 'La fecha de caducidad debe ser posterior a la fecha de inicio.', 'error');
        return;
      }
    }

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
      const palabrasClaveFormateadas = this.keywords.map(keyword => ({ nombre: keyword }));
      formData.append('detallePalabraClave', JSON.stringify(palabrasClaveFormateadas));
    }

    const cursoId = this.cursoForm.get('id')?.value
    this.loading = true;
    if (cursoId) {
      // Si estamos editando, enviamos el ID en el formData
      formData.append('id', cursoId);

      this.etiqueteraService.updateCourse(cursoId, formData)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El curso ha sido actualizado.', 'success');
            this.resetForm();
            this.loading = false;
            this.modalService.dismissAll();
          },
          error: () => {
            Swal.fire('Error', 'Ha ocurrido un error al actualizar el curso.', 'error');
            this.loading = false;
          },
        });
    } else {
      this.etiqueteraService.createCourse(formData).subscribe({
        next: () => {
          Swal.fire('Registrado', 'El curso ha sido registrado.', 'success');
          this.resetForm();
          this.loading = false;
          this.modalService.dismissAll();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo registrar el curso.', 'error');
          this.loading = true;
        },
      });
    }
  }

  // Parte encargado
  loadEncargados(): void {
    //this.loading = true;
    this.encargadoService.getEncargados().subscribe((encargados) => {
      this.encargados = encargados;
      //this.loading = false;
    },
      (err) => {
        console.error('Error al cargar encargados:', err)
        //this.loading = false;
      }
    )
  }

  onEncargadoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'new') {
      this.openEncargadoModal();
    }
  }

  openEncargadoModal(): void {
    this.encargadoModalRef = this.modalService.open(this.encargadoModal);
  }

  onEncargadoImageChange(): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.encargadoImagePreview = e.target.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onEncargadoSubmit(): void {
    if (this.encargadoForm.valid) {
      const encargado: Encargado = this.encargadoForm.value;
      this.loading = true;
      this.encargadoService.createEncargado(encargado).subscribe(() => {
        Swal.fire('Registrado', 'El Responsable del curso ha sido registrado', 'success');
        this.loadEncargados();
        this.loading = false;
        this.encargadoModalRef?.close();
        this.resetEnForm();
      }, error => {
        console.log('Error registrando encargado', error)
        Swal.fire('Error', 'No se pudo registrar el encargado.', 'error')
        this.loading = false;
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
    this.keywords = [];
    this.logoPreview = null;
    $('#summernote').summernote('reset');
  }

  resetEnForm(): void {
    this.encargadoForm.reset();
    this.encargadoImagePreview = null;
  }

  //cerrar modal
  closeModal(): void {
    this.modalService.dismissAll();
  }

}
