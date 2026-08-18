import '@angular/compiler'
import { TestBed } from '@angular/core/testing'
import {
  BrowserTestingModule,
  platformBrowserTesting
} from '@angular/platform-browser/testing'
import '@tools/tests'

export * from '@tools/tests'

TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting())
