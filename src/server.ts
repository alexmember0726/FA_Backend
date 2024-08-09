import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { PropertyRoute } from '@/routes/properties.route';
import { InquiryRoute } from './routes/inquiries.route';
import { ValidateEnv } from '@utils/validateEnv';
import { FavoriteRoute } from './routes/favorites.route';
import { SettingRoute } from './routes/settings.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new PropertyRoute(), new InquiryRoute(), new FavoriteRoute(), new SettingRoute()]);

app.listen();
