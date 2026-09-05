import './styles/global.css';
import { Router } from './core/router/router.ts';
import './components/site-nav/site-nav.ts';
import './components/site-footer/site-footer.ts';
import './components/home-page/home-page.ts';
import './components/projects-page/projects-page.ts';
import './components/research-page/research-page.ts';
import './components/about-page/about-page.ts';

// An organisation Pages site lives at the domain root, so the base is always
// '/'. Boba's template derives the base from the first path segment, which is
// correct for a project site at /<repo>/ and wrong here: it would read
// /projects as the repository name and then fail to match any route.
(window as Window & { BOBA_BASE_URL?: string }).BOBA_BASE_URL = '/';

const router = Router.getInstance();
router.registerRoute({ path: '/', component: 'home-page' });
router.registerRoute({ path: '/projects', component: 'projects-page' });
router.registerRoute({ path: '/research', component: 'research-page' });
router.registerRoute({ path: '/about', component: 'about-page' });

// GitHub Pages serves 404.html for any path that is not a file, and the deploy
// workflow makes 404.html a byte-copy of index.html. A deep link therefore
// arrives here with the real path still in the URL bar, and the router picks it
// up from there rather than from a redirect.
router.navigate(window.location.pathname + window.location.search);
