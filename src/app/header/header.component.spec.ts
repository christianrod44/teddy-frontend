import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { of } from 'rxjs';

class MockRouter {
  createUrlTree = (commands: any[], navigationExtras?: any): UrlTree => {
    return {
      root: { children: {} as any },
      queryParams: {},
      fragment: null,
      toString: () => {
        const path = commands.flat().join('/');
        const query = navigationExtras?.queryParams ? '?' + new URLSearchParams(navigationExtras.queryParams).toString() : '';
        const fragment = navigationExtras?.fragment ? '#' + navigationExtras.fragment : '';
        return `${path}${query}${fragment}`;
      }
    } as UrlTree;
  };

  serializeUrl = (url: UrlTree): string => {
    return url.toString();
  };

  navigate = jasmine.createSpy('navigate');
  navigateByUrl = jasmine.createSpy('navigateByUrl');
  url = '/current-path';
  events = of({});
}

class MockActivatedRoute {
  snapshot = {
    paramMap: new Map(),
    queryParamMap: new Map()
  };
  params = of({});
  queryParams = of({});
  data = of({});
  url = of([]);
  parent = null;
  root = this;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let localStorageGetItemSpy: jasmine.Spy;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    localStorageGetItemSpy = spyOn(localStorage, 'getItem').and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        CommonModule
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not throw error when RouterLink is present', () => {
    fixture.detectChanges();
    expect(true).toBeTrue();
  });
});