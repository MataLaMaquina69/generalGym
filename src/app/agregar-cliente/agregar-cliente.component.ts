import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {
  clientForm: FormGroup;
  percentage: number;
  imgUrl: string;
  editable = false;
  id: string;

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private activeRoute: ActivatedRoute,
    private messageService: MessagesService) { }

  ngOnInit(): void {
    this.clientForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      registro: [''],
      fechaNacimiento: ['', Validators.required],
      telefono: [''],
      imgUrl: ['', Validators.required]
    });




    this.id = this.activeRoute.snapshot.params.clientID;
    console.log(this.id);

    if (this.id != undefined) {
      this.editable = true;

      this.db.doc<any>('clientes/' + this.id).valueChanges().subscribe((client) => {

        console.log(client);
        this.clientForm.setValue({
          nombre: client.nombre,
          apellido: client.apellido,
          correo: client.correo,
          fechaNacimiento: new Date(client.fechaNacimiento.seconds * 1000).toISOString().substring(0, 10),
          telefono: client.telefono,
          registro: client.registro,
          imgUrl: ''

        });
        this.imgUrl = client.imgUrl;
      });
    }


  }

  add() {
    this.clientForm.value.imgUrl = this.imgUrl;
    this.clientForm.value.fechaNacimiento = new Date(this.clientForm.value.fechaNacimiento);
    console.log(this.clientForm.value);
    this.db.collection('clientes').add(this.clientForm.value).then((finish) => {
      this.messageService.successMessage('Agregar', 'Se agregó el cliente');
    }).catch((error) => {
      this.messageService.errorMessage('Error', 'No se pudo agregar el cliente')
    });
  }

  uploadImage(event) {
    if (event.target.files.length > 0) {

      let imgName = new Date().getTime().toString();
      let file = event.target.files[0];
      let imgExtension = file.name.toString().substring(file.name.toString().lastIndexOf('.'));
      let path = 'clientes/' + imgName + imgExtension;
      const ref = this.storage.ref(path);
      const task = ref.put(file);

      task.then((obj) => {
        console.log('image uploaded');
        this.messageService.successMessage('Imagen Cargada', 'Se cargó correctamente la imagen');
        
        ref.getDownloadURL().subscribe((url) => {
          this.imgUrl = url;
        });
      }).catch((error) => {
        this.messageService.errorMessage('Error', 'Ocurrió un error al cargar la imagen');
      });
      task.percentageChanges().subscribe((pecent) => {
        this.percentage = parseInt(pecent.toString());
      });
    }

  }

  edit() {
    this.clientForm.value.imgUrl = this.imgUrl;
    this.clientForm.value.fechaNacimiento = new Date(this.clientForm.value.fechaNacimiento);

    this.db.doc('clientes/' + this.id).update(this.clientForm.value).then((result) => {
      console.log('Updated');
      this.messageService.successMessage('Actualizado', 'Se actualizó el cliente');

    }).catch((err) => {
      this.messageService.errorMessage('Error', 'No se actualizó');
      console.error(err);
    });



  }

}
