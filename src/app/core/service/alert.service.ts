import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  private subject = new Subject<any>();

  constructor() { }

  opensweetalert(type: string, title: string, text: string) {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  openConfirmation(title: string, text: string): Observable<any> {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.subject.next({ text: result.value });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          /* Read more about handling dismissals below */
          this.subject.next({ text: result.isConfirmed });
        }
      });
    return this.subject.asObservable();
  }
}
