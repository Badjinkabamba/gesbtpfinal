import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Devis } from './devis.model';
import { DevisService } from './devis.service';

@Injectable()
export class DevisPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private devisService: DevisService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.devisService.find(id)
                    .subscribe((devisResponse: HttpResponse<Devis>) => {
                        const devis: Devis = devisResponse.body;
                        if (devis.dateDeCreation) {
                            devis.dateDeCreation = {
                                year: devis.dateDeCreation.getFullYear(),
                                month: devis.dateDeCreation.getMonth() + 1,
                                day: devis.dateDeCreation.getDate()
                            };
                        }
                        if (devis.validite) {
                            devis.validite = {
                                year: devis.validite.getFullYear(),
                                month: devis.validite.getMonth() + 1,
                                day: devis.validite.getDate()
                            };
                        }
                        this.ngbModalRef = this.devisModalRef(component, devis);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.devisModalRef(component, new Devis());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    devisModalRef(component: Component, devis: Devis): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.devis = devis;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
