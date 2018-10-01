import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { MatKeyboardModule } from '../keyboard.module';
import { MatKeyboardService } from './keyboard.service';

describe('Keyboard service', () => {

  let keyboardService: MatKeyboardService;

  beforeEach(
    async(() => {
      // configure test module
      TestBed.resetTestEnvironment();
      TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          MatKeyboardModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      TestBed
        .compileComponents()
        .then(() => {
          // get service instance
          keyboardService = TestBed.get(MatKeyboardService);
        });

      // Mock implementation of console.error to
      // return undefined to stop printing out to console log during test
      jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
    })
  );

  it('should create an instance successfully', () => {
    expect(keyboardService)
      .toBeDefined();
  });

  it('should open a keyboard instance', () => {
    keyboardService.open('de', {});
    expect(keyboardService.isOpened)
      .toBeTruthy();
  });

});
