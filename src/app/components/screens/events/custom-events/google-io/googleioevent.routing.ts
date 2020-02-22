import { NgModule} from '@angular/core';
import {RouterModule ,  Routes} from '@angular/router';

import { GoogleioeventpageComponent } from './components/googleioeventpage/googleioeventpage.component';

const routes :  Routes = [
    {
        path : "" ,component:GoogleioeventpageComponent
    }
]

@NgModule({
    exports:[RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class GoogleIOEventRoutingModule{}
