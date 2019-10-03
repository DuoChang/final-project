module.exports = function (result){

	for(let j = 0 ; j < result.length ; j++ ){

		let skillarray = [];

		let skillstringtoarray = result[j].orderskill.split(',');

		for( let i = 0 ; i < skillstringtoarray.length ; i++ ){

			if( skillstringtoarray[i] == 'light' ){
				skillarray.push('燈具維修');
			}else if( skillstringtoarray[i] == 'toilet' ){
				skillarray.push('馬桶裝修');
			}else if( skillstringtoarray[i] == 'waterheater' ){
				skillarray.push('熱水器');
			}else if( skillstringtoarray[i] == 'pipe' ){
				skillarray.push('水管');
			}else if( skillstringtoarray[i] == 'faucet' ){
				skillarray.push('水龍頭');
			}else if( skillstringtoarray[i] == 'bathtub' ){
				skillarray.push('浴缸/淋浴設備');
			}else if( skillstringtoarray[i] == 'wire' ){
				skillarray.push('電線');
			}else if( skillstringtoarray[i] == 'soil' ){
				skillarray.push('補土');
			}else if( skillstringtoarray[i] == 'paint' ){
				skillarray.push('油漆');
			}else if( skillstringtoarray[i] == 'wallpaper' ){
				skillarray.push('壁紙');
			}else if( skillstringtoarray[i] == 'tile' ){
				skillarray.push('磁磚');
			}

		}

		result[j].orderskill = skillarray;

	}

	return result;
	
};
