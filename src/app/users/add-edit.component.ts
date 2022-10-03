import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    selectedFile: File = null;

    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            sampleFile: ['', Validators.required],
            username: ['', Validators.required]
        });
    }

    get f() { return this.form.controls; }

    onfileSelected(event): void {
      this.selectedFile = <File>event.target.files[0];
      this.form.patchValue({
        sampleFile: this.selectedFile
      })
      this.form.get('sampleFile').updateValueAndValidity;
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        this.loading = true;
        this.uploadData();
    }

    private uploadData() {
        const fd = new FormData();
        fd.append('image', this.selectedFile, this.selectedFile.name);
        localStorage.setItem('imgData', JSON.stringify(fd));
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
