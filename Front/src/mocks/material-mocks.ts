import { Component } from '@angular/core';

@Component({ selector: 'mat-label', template: '<ng-content></ng-content>' })
export class MockMatLabel {}

@Component({ selector: 'mat-error', template: '<ng-content></ng-content>' })
export class MockMatError {}

@Component({ selector: 'mat-select', template: '' })
export class MockMatSelect {}

@Component({ selector: 'mat-icon', template: '<ng-content></ng-content>' })
export class MockMatIcon {}