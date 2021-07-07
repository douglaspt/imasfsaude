import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlano } from '../plano.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { PlanoService } from '../service/plano.service';
import { PlanoDeleteDialogComponent } from '../delete/plano-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-plano',
  templateUrl: './plano.component.html',
})
export class PlanoComponent implements OnInit {
  planos: IPlano[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected planoService: PlanoService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.planos = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.planoService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IPlano[]>) => {
          this.isLoading = false;
          this.paginatePlanos(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.planos = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPlano): number {
    return item.id!;
  }

  delete(plano: IPlano): void {
    const modalRef = this.modalService.open(PlanoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.plano = plano;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginatePlanos(data: IPlano[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.planos.push(d);
      }
    }
  }
}
