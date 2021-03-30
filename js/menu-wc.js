'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">ngx-material-keyboard-src documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/MatKeyboardModule.html" data-type="entity-link">MatKeyboardModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'data-target="#xs-components-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'id="xs-components-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                        <li class="link">
                                            <a href="components/MatKeyboardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatKeyboardComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MatKeyboardContainerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatKeyboardContainerComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MatKeyboardKeyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatKeyboardKeyComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#directives-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'data-target="#xs-directives-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                    <span class="icon ion-md-code-working"></span>
                                    <span>Directives</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="directives-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'id="xs-directives-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                        <li class="link">
                                            <a href="directives/MatKeyboardDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatKeyboardDirective</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'data-target="#xs-injectables-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'id="xs-injectables-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                        <li class="link">
                                            <a href="injectables/MatKeyboardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>MatKeyboardService</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#pipes-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'data-target="#xs-pipes-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                    <span class="icon ion-md-add"></span>
                                    <span>Pipes</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="pipes-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' : 'id="xs-pipes-links-module-MatKeyboardModule-569ac9c2ceaeefdb8111087b4da17c69"' }>
                                        <li class="link">
                                            <a href="pipes/MatKeyboardKebabCasePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MatKeyboardKebabCasePipe</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/MatKeyboardConfig.html" data-type="entity-link">MatKeyboardConfig</a>
                    </li>
                    <li class="link">
                        <a href="classes/MatKeyboardRef.html" data-type="entity-link">MatKeyboardRef</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                    <li class="link">
                        <a href="interfaces/IKeyboardDeadkeys.html" data-type="entity-link">IKeyboardDeadkeys</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/IKeyboardIcons.html" data-type="entity-link">IKeyboardIcons</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/IKeyboardLayout.html" data-type="entity-link">IKeyboardLayout</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/IKeyboardLayouts.html" data-type="entity-link">IKeyboardLayouts</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/ILocaleMap.html" data-type="entity-link">ILocaleMap</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise-inverted.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
