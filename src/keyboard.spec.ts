import { CommonModule } from '@angular/common';
import { Component, Directive, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flushMicrotasks, inject, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer, OverlayContainer } from '../core';
import { KeyboardComponent, MdKeyboard, MdKeyboardConfig, MdKeyboardModule } from './index';


// TODO(josephperrott): Update tests to mock waiting for time to complete for animations.

describe('MdKeyboard', () => {
  let keyboard: MdKeyboard;
  let liveAnnouncer: LiveAnnouncer;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  let simpleMessage = 'Burritos are here!';
  let simpleActionLabel = 'pickup';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdKeyboardModule, KeyboardTestModule, NoopAnimationsModule],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }
        }
      ],
    });
    TestBed.compileComponents();
  }));

  beforeEach(inject([MdKeyboard, LiveAnnouncer], (sb: MdKeyboard, la: LiveAnnouncer) => {
    keyboard = sb;
    liveAnnouncer = la;
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
    liveAnnouncer._removeLiveElement();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should have the role of alert', () => {
    let config = { viewContainerRef: testViewContainerRef };
    keyboard.open(simpleMessage, simpleActionLabel, config);

    let containerElement = overlayContainerElement.querySelector('keyboard-container');
    expect(containerElement.getAttribute('role'))
      .toBe('alert', 'Expected keyboard container to have role="alert"');
  });

  it('should open and close a keyboard without a ViewContainerRef', async(() => {
    let keyboardRef = keyboard.open('Snack time!', 'CHEW');
    viewContainerFixture.detectChanges();

    let messageElement = overlayContainerElement.querySelector('keyboard-container');
    expect(messageElement.textContent).toContain('Snack time!',
      'Expected keyboard to show a message without a ViewContainerRef');

    keyboardRef.dismiss();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.childNodes.length)
        .toBe(0, 'Expected keyboard to be dismissed without a ViewContainerRef');
    });
  }));

  it('should open a simple message with a button', () => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, simpleActionLabel, config);

    viewContainerFixture.detectChanges();

    expect(keyboardRef.instance)
      .toEqual(jasmine.any(KeyboardComponent),
        'Expected the keyboard content component to be KeyboardComponent');
    expect(keyboardRef.instance.keyboardRef)
      .toBe(keyboardRef, 'Expected the keyboard reference to be placed in the component instance');

    let messageElement = overlayContainerElement.querySelector('keyboard-container');
    expect(messageElement.textContent)
      .toContain(simpleMessage, `Expected the keyboard message to be '${simpleMessage}'`);

    let buttonElement = overlayContainerElement.querySelector('button.mat-keyboard-action');
    expect(buttonElement.tagName)
      .toBe('BUTTON', 'Expected keyboard action label to be a <button>');
    expect(buttonElement.textContent)
      .toBe(simpleActionLabel,
        `Expected the keyboard action label to be '${simpleActionLabel}'`);
  });

  it('should open a simple message with no button', () => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, null, config);

    viewContainerFixture.detectChanges();

    expect(keyboardRef.instance)
      .toEqual(jasmine.any(KeyboardComponent),
        'Expected the keyboard content component to be KeyboardComponent');
    expect(keyboardRef.instance.keyboardRef)
      .toBe(keyboardRef, 'Expected the keyboard reference to be placed in the component instance');

    let messageElement = overlayContainerElement.querySelector('keyboard-container');
    expect(messageElement.textContent)
      .toContain(simpleMessage, `Expected the keyboard message to be '${simpleMessage}'`);
    expect(overlayContainerElement.querySelector('button.mat-keyboard-action'))
      .toBeNull('Expected the query selection for action label to be null');
  });

  it('should dismiss the keyboard and remove itself from the view', async(() => {
    let config = { viewContainerRef: testViewContainerRef };
    let dismissObservableCompleted = false;

    let keyboardRef = keyboard.open(simpleMessage, null, config);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount)
      .toBeGreaterThan(0, 'Expected overlay container element to have at least one child');

    keyboardRef.afterDismissed().subscribe(null, null, () => {
      dismissObservableCompleted = true;
    });

    keyboardRef.dismiss();
    viewContainerFixture.detectChanges();  // Run through animations for dismissal

    viewContainerFixture.whenStable().then(() => {
      expect(dismissObservableCompleted).toBeTruthy('Expected the keyboard to be dismissed');
      expect(overlayContainerElement.childElementCount)
        .toBe(0, 'Expected the overlay container element to have no child elements');
    });
  }));

  it('should be able to get dismissed through the service', async(() => {
    keyboard.open(simpleMessage);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    keyboard.dismiss();
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.childElementCount).toBe(0);
    });
  }));

  it('should clean itself up when the view container gets destroyed', async(() => {
    keyboard.open(simpleMessage, null, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    viewContainerFixture.componentInstance.childComponentExists = false;
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      expect(overlayContainerElement.childElementCount)
        .toBe(0, 'Expected keyboard to be removed after the view container was destroyed');
    });
  }));

  it('should open a custom component', () => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.openFromComponent(BurritosNotification, config);

    expect(keyboardRef.instance)
      .toEqual(jasmine.any(BurritosNotification),
        'Expected the keyboard content component to be BurritosNotification');
    expect(overlayContainerElement.textContent.trim())
      .toBe('Burritos are on the way.',
        `Expected the overlay text content to be 'Burritos are on the way'`);
  });

  it('should set the animation state to visible on entry', () => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, null, config);

    viewContainerFixture.detectChanges();
    expect(keyboardRef.containerInstance.animationState)
      .toBe('visible', `Expected the animation state would be 'visible'.`);
  });

  it('should set the animation state to complete on exit', () => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, null, config);
    keyboardRef.dismiss();

    viewContainerFixture.detectChanges();
    expect(keyboardRef.containerInstance.animationState)
      .toBe('complete', `Expected the animation state would be 'complete'.`);
  });

  it(`should set the old keyboard animation state to complete and the new keyboard animation
      state to visible on entry of new keyboard`, async(() => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, null, config);
    let dismissObservableCompleted = false;

    viewContainerFixture.detectChanges();
    expect(keyboardRef.containerInstance.animationState)
      .toBe('visible', `Expected the animation state would be 'visible'.`);

    let config2 = { viewContainerRef: testViewContainerRef };
    let keyboardRef2 = keyboard.open(simpleMessage, null, config2);

    viewContainerFixture.detectChanges();
    keyboardRef.afterDismissed().subscribe(null, null, () => {
      dismissObservableCompleted = true;
    });

    viewContainerFixture.whenStable().then(() => {
      expect(dismissObservableCompleted).toBe(true);
      expect(keyboardRef.containerInstance.animationState)
        .toBe('complete', `Expected the animation state would be 'complete'.`);
      expect(keyboardRef2.containerInstance.animationState)
        .toBe('visible', `Expected the animation state would be 'visible'.`);
    });
  }));

  it('should open a new keyboard after dismissing a previous keyboard', async(() => {
    let config = { viewContainerRef: testViewContainerRef };
    let keyboardRef = keyboard.open(simpleMessage, 'DISMISS', config);
    viewContainerFixture.detectChanges();

    keyboardRef.dismiss();
    viewContainerFixture.detectChanges();

    // Wait for the keyboard dismiss animation to finish.
    viewContainerFixture.whenStable().then(() => {
      keyboardRef = keyboard.open('Second keyboard', 'DISMISS', config);
      viewContainerFixture.detectChanges();

      // Wait for the keyboard open animation to finish.
      viewContainerFixture.whenStable().then(() => {
        expect(keyboardRef.containerInstance.animationState).toBe('visible');
      });
    });
  }));

  it('should remove past keyboards when opening new keyboards', async(() => {
    keyboard.open('First keyboard');
    viewContainerFixture.detectChanges();

    keyboard.open('Second keyboard');
    viewContainerFixture.detectChanges();

    viewContainerFixture.whenStable().then(() => {
      keyboard.open('Third keyboard');
      viewContainerFixture.detectChanges();

      viewContainerFixture.whenStable().then(() => {
        expect(overlayContainerElement.textContent.trim()).toBe('Third keyboard');
      });
    });
  }));

  it('should remove keyboard if another is shown while its still animating open', fakeAsync(() => {
    keyboard.open('First keyboard');
    viewContainerFixture.detectChanges();

    keyboard.open('Second keyboard');
    viewContainerFixture.detectChanges();

    // Flush microtasks to make observables run, but don't tick such that any animations would run.
    flushMicrotasks();
    expect(overlayContainerElement.textContent.trim()).toBe('Second keyboard');

    // Let remaining animations run.
    tick(500);
  }));

  it('should dismiss the keyboard when the action is called, notifying of both action and dismiss',
    fakeAsync(() => {
      let dismissObservableCompleted = false;
      let actionObservableCompleted = false;
      let keyboardRef = keyboard.open('Some content', 'dismiss');
      viewContainerFixture.detectChanges();

      keyboardRef.afterDismissed().subscribe(null, null, () => {
        dismissObservableCompleted = true;
      });
      keyboardRef.onAction().subscribe(null, null, () => {
        actionObservableCompleted = true;
      });

      let actionButton =
        overlayContainerElement.querySelector('.mat-keyboard-action') as HTMLButtonElement;
      actionButton.click();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(dismissObservableCompleted).toBeTruthy('Expected the keyboard to be dismissed');
      expect(actionObservableCompleted).toBeTruthy('Expected the keyboard to notify of action');

      tick(500);
    }));

  it('should dismiss automatically after a specified timeout', fakeAsync(() => {
    let dismissObservableCompleted = false;
    let config = new MdKeyboardConfig();
    config.duration = 250;
    let keyboardRef = keyboard.open('content', 'test', config);
    keyboardRef.afterDismissed().subscribe(() => {
      dismissObservableCompleted = true;
    });

    viewContainerFixture.detectChanges();
    flushMicrotasks();
    expect(dismissObservableCompleted).toBeFalsy('Expected the keyboard not to be dismissed');

    tick(1000);
    viewContainerFixture.detectChanges();
    flushMicrotasks();
    expect(dismissObservableCompleted).toBeTruthy('Expected the keyboard to be dismissed');
  }));

  it('should add extra classes to the container', () => {
    keyboard.open(simpleMessage, simpleActionLabel, {
      viewContainerRef: testViewContainerRef,
      extraClasses: ['one', 'two']
    });

    let containerClasses = overlayContainerElement.querySelector('keyboard-container').classList;

    expect(containerClasses).toContain('one');
    expect(containerClasses).toContain('two');
  });
});

describe('MdKeyboard with parent MdKeyboard', () => {
  let parentKeyboard: MdKeyboard;
  let childKeyboard: MdKeyboard;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesMdKeyboard>;
  let liveAnnouncer: LiveAnnouncer;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MdKeyboardModule, KeyboardTestModule, NoopAnimationsModule],
      declarations: [ComponentThatProvidesMdKeyboard],
      providers: [
        {
          provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }
        }
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([MdKeyboard, LiveAnnouncer], (sb: MdKeyboard, la: LiveAnnouncer) => {
    parentKeyboard = sb;
    liveAnnouncer = la;

    fixture = TestBed.createComponent(ComponentThatProvidesMdKeyboard);
    childKeyboard = fixture.componentInstance.keyboard;
    fixture.detectChanges();
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
    liveAnnouncer._removeLiveElement();
  });

  it('should close keyboards opened by parent when opening from child MdKeyboard', fakeAsync(() => {
    parentKeyboard.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .toContain('Pizza', 'Expected a keyboard to be opened');

    childKeyboard.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .toContain('Taco', 'Expected parent keyboard msg to be dismissed by opening from child');
  }));

  it('should close keyboards opened by child when opening from parent MdKeyboard', fakeAsync(() => {
    childKeyboard.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .toContain('Pizza', 'Expected a keyboard to be opened');

    parentKeyboard.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .toContain('Taco', 'Expected child keyboard msg to be dismissed by opening from parent');
  }));
});

@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'arbitrary-component',
  template: `
    <dir-with-view-container *ngIf="childComponentExists"></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  childComponentExists: boolean = true;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Burritos are on the way.</p>' })
class BurritosNotification {
}


@Component({
  template: '',
  providers: [MdKeyboard]
})
class ComponentThatProvidesMdKeyboard {
  constructor(public keyboard: MdKeyboard) {
  }
}


/** Simple component to open keyboards from.
 * Create a real (non-test) NgModule as a workaround forRoot
 * https://github.com/angular/angular/issues/10760
 */
const TEST_DIRECTIVES = [
  ComponentWithChildViewContainer,
  BurritosNotification,
  DirectiveWithViewContainer
];
@NgModule({
  imports: [CommonModule, MdKeyboardModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ComponentWithChildViewContainer, BurritosNotification],
})
class KeyboardTestModule {
}
