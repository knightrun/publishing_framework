import serverTask from './server/tasks/serverTask';
import productTask from './build/tasks/productTask';
// import miscTask from  './build/tasks/miscTask';

export default ( $, options ) => {
    serverTask( $, options );
    productTask( $, options );
    // miscTask( $, options );
}