import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from '../../services/guards/login.guard';

import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { SettingsComponent } from '../settings/settings.component';
const pagesRoutes: Routes = [
	{
		path: '',
		component: DefaultComponent,
		//canActivate: [ LoginGuard ],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'posts', component: PostsComponent },
			{ path: 'recibos', component: ReceiptComponent },
			{ path: 'settings', component: SettingsComponent },
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
