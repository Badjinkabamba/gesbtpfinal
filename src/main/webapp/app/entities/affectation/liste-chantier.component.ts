import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Affectation } from './affectation.model';
import { AffectationService } from './affectation.service';
import {ChantierService} from '../chantier/chantier.service';
import {Chantier} from '../chantier/chantier.model';
import {EtatAffectation} from './affectation.model';
import 'rxjs/add/operator/map';
import { Chart } from 'chart.js';
import { MatTableDataSource, MatSort, MatPaginator, MatIconRegistry } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'jhi-liste-chantier',
    templateUrl: './liste-chantier.component.html',
    styleUrls: [
        'affectation.css'
    ]
})
export class ListeChantierComponent implements OnInit, OnDestroy {

    affectations: Affectation[];
    affectation: Affectation = new Affectation();
    id: number;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    chantier: Chantier;
    isCollapsed = [true];
    isCollapsed1 = [true];
    collapse = [true];
    isMess = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns = ['dateDebut', 'dateFin', 'nomTrav', 'etat', 'det'];
    dataSource: MatTableDataSource<Affectation>;
    public lineChartData: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
        {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
      ];
      public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
      public lineChartOptions: any = {
        responsive: true
      };
      panelOpenState = false;

    constructor(
        private eventManager: JhiEventManager,
        private affectationService: AffectationService,
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.afficherMessage();
        this.subscription = this.route.params.subscribe((params) => {
            this.id = params['id'];
            this.load(params['id']);
            sessionStorage.setItem('idChantier', params['id'] );
        });
        this.registerChangeInAffectations();
    }
    load(id) {
        this.affectationService.findByChantier(id)
            .subscribe((affectationResponse: HttpResponse<Affectation[]>) => {
                this.affectations = affectationResponse.body;
                this.dataSource = new MatTableDataSource(this.affectations);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                    this.chantierService.find(id)
                        .subscribe((chantierResponse: HttpResponse<Chantier>) => {
                            this.chantier = chantierResponse.body;
                        });
            });
    }
    previousState() {
        this.router.navigate(['/chantiers/', +sessionStorage.getItem('idClient') ]);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInAffectations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'affectationListModification',
            (response) => this.load(this.id)
        );
    }

    afficherMessage() {
        setTimeout(
            () => {
                this.isMess = false;
            }, 4000
        );
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
      }
}
