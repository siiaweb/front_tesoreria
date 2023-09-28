import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from '../../services/guards/login.guard';

import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { ReceiptComponent } from '../receipt/receipt.component';
import { ShoppingcartComponent } from '../shoppingcart/shoppingcart.component';
import { DiscountComponent } from '../discount/discount.component';
import { ListausuarioComponent } from '../listausuario/listausuario.component';
import { ResetpassComponent } from '../resetpass/resetpass.component';
import { NewsComponent } from '../news/news.component';
import { NewformComponent } from '../news/newform/newform.component';
import { SettingsComponent } from '../settings/settings.component';
import { BannersComponent } from '../banners/banners.component';
import { BannerUploadComponent } from '../banners/banner-upload/banner-upload.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { FaqsformComponent } from '../faqs/faqsform/faqsform.component';
import { TeamComponent } from '../team/team.component';
import { TeamformComponent } from '../team/teamform/teamform.component';
import { ServicesComponent } from '../services/services.component';
import { ServicesformComponent } from '../services/servicesform/servicesform.component';
import { PagosSiiaService } from 'src/app/services/services.index';
import { PagossiiaComponent } from '../pagossiia/pagossiia.component';
import { RecepcionRecibosComponent } from '../recepcion-recibos/recepcion-recibos.component';
import { ConsultaPagoRecibidoComponent } from '../consulta-pago-recibido/consulta-pago-recibido.component';
const pagesRoutes: Routes = [
	{
		path: '',
		component: DefaultComponent,
		//canActivate: [ LoginGuard ],
		children: [
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'posts', component: PostsComponent },
			{ path: 'recibos', component: ReceiptComponent },
			{ path: 'shoppingcart', component: ShoppingcartComponent },
			{ path: 'descuentos', component: DiscountComponent },
			{ path: 'listausuario', component: ListausuarioComponent },
			{ path: 'noticias', component: NewsComponent },
			{ path: 'noticiasform/:id/:acc', component: NewformComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: 'banners', component: BannersComponent },
			{ path: 'bannersUpload/:id/:acc', component: BannerUploadComponent },
			{ path: 'faqs', component: FaqsComponent },
			{ path: 'faqsform/:id/:acc', component: FaqsformComponent },
			{ path: 'team', component: TeamComponent },
			{ path: 'teamform/:id/:acc', component: TeamformComponent },
			{ path: 'services', component: ServicesComponent },
			{ path: 'servicesform/:id/:acc', component: ServicesformComponent },
			{ path: 'pagossiia', component: PagossiiaComponent },	
			{ path: 'recepcionrecibos', component: RecepcionRecibosComponent },
			{ path: 'consultapagorecibido', component: ConsultaPagoRecibidoComponent },
			{ path: 'resetpass', component: ResetpassComponent }
		]
	}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
