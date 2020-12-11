import serverTask from './tasks/serverTask';
import productTask from './tasks/productTask';

export default () => {
    serverTask();
    productTask();
}