//다른 페이지의 macro를 import한 template에서는 addFilter가 2번 호출되며 처음에는 첫 인자값으로 받는 객체를 undifined로 인식하기 때문에 limit 처럼 예외처리를 다 해줘야 한다.
import lodash from 'lodash';

export default ( env ) => {
	const _ = lodash;

	env.addFilter('is_string', function(obj) {
		return typeof obj == 'string';
	});
	// Filter
	env.addFilter('pushIn', (array, value) => {
		array.push(value);
		return array;
	});

	env.addFilter('addGlobalVar', (value, key) => {
		//console.log( value )
		env.vars = env.vars || {};
		env.vars[key] = value;
	});

	env.addFilter('limit', (arr, start, end) => {
		// console.log('limit');
		try {
			return arr.slice(start, end);
		} catch (e) {
			console.log(`limit error : ${e.message}`);
		}
	});

	// function
	env.addGlobal('_', _ );

	env.addGlobal('splitVar', (value, str) => {
		let arr = value.split(str);
		return arr;
	});

	env.addGlobal('_eval', ( param ) => {
		return eval( param );
	});

	env.addGlobal('assign', (base,target) => {
		return _.assignWith( base, target, (baseValue, targetValue) => {
			if( _.isArray(baseValue) ){
				return _.concat(baseValue, targetValue);
			}
			if( _.isObject(baseValue) ){
				return _.assign(baseValue, targetValue);
			}
		});
	});

	env.addGlobal('log', ( param ) => {
		console.log( JSON.stringify(param, null, 2) );
	});

	env.addGlobal('BEM', (block,element,modifier) => {
		let klass = '';
		if( !element && !modifier ){
			return '';
		}
		if( element ){
			klass = block+'__'+element;
		}
		if( modifier ){
			klass = block+'--'+modifier;
		}
		return klass;
	});

	env.addGlobal('attr', (attrName,dataObj) => {
		let str = '';

		if( typeof dataObj !== 'object'){
			return str;
		}

		if( !dataObj.hasOwnProperty( attrName )){
			return str;
		}

		let attrVal = dataObj[attrName];

		if( attrVal ){

			// 데이터 셋
			if( (attrName.search(/dataAttr/i) !== -1) && typeof attrVal === 'object') {
				Object.keys(attrVal).forEach((key) => {
					if( key && attrVal[key] ){
						str += `data-${key}="${attrVal[key]}" `;
					}
				})
				// 클래스명
			} else if ( attrName === 'class' ) {
				var className = '';
				if (Array.isArray(attrVal)) {
					className = `${ attrVal.join(' ') }`;
				} else {
					className = attrVal;
				}

				if (className) {
					str = `class="${ className }"`;
				}
				// disabeld
			} else if ( attrName === 'disabled' && attrVal ){
				// if( Array.isArray(dataObj.class) ){
				// 	dataObj.class.push('is-disabled');
				// } else {
				// 	dataObj.class += ' is-disabled';
				// }
				attrVal = 'disabled';
				str = `${attrName}="${attrVal}"`;
				// checked
			} else if ( attrName === 'checked' && attrVal ){
				attrVal = 'checked';
				str = `${attrName}="${attrVal}"`;
				// Etc
			} else {
				if( attrName === 'target' && attrVal === '_blank' ){
					if( !dataObj.title.length ){
						dataObj.title = '새창';
					}
				}
				str = `${attrName}="${attrVal}"`;
			}

		}
		return str;
	});

	env.addGlobal('lazyImgSrc', (index, imgSrc, widthRatio, heightRatio) =>  {
		let zoom = 30;
        let lazySrc = '';
        let baseURL = 'https://picsum.photos/';

		_.isUndefined( widthRatio ) && (widthRatio = '16');
		_.isUndefined( heightRatio ) && (heightRatio = '9');

		widthRatio = widthRatio*zoom;
		heightRatio = heightRatio*zoom;

		if( imgSrc.includes( baseURL ) ){
			lazySrc = imgSrc.replace(/(\d+)\/(\d+)/g, `${widthRatio}/${heightRatio}`);
		} else {
			lazySrc = `${baseURL}${widthRatio}/${heightRatio}`;
		}

		return index ? lazySrc : imgSrc;
	});
};