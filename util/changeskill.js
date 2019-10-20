module.exports = function (result){

	for(let j = 0 ; j < result.length ; j++ ){

		let skill_array = [];

		let skill_string_to_array = result[j].orderskill.split(',');

		for( let i = 0 ; i < skill_string_to_array.length ; i++ ){

			if( skill_string_to_array[i] == 'light' ){
				skill_array.push('燈具維修');
			}else if( skill_string_to_array[i] == 'toilet' ){
				skill_array.push('馬桶裝修');
			}else if( skill_string_to_array[i] == 'waterheater' ){
				skill_array.push('熱水器');
			}else if( skill_string_to_array[i] == 'pipe' ){
				skill_array.push('水管');
			}else if( skill_string_to_array[i] == 'faucet' ){
				skill_array.push('水龍頭');
			}else if( skill_string_to_array[i] == 'bathtub' ){
				skill_array.push('浴缸/淋浴設備');
			}else if( skill_string_to_array[i] == 'wire' ){
				skill_array.push('電線');
			}else if( skill_string_to_array[i] == 'soil' ){
				skill_array.push('補土');
			}else if( skill_string_to_array[i] == 'paint' ){
				skill_array.push('油漆');
			}else if( skill_string_to_array[i] == 'wallpaper' ){
				skill_array.push('壁紙');
			}else if( skill_string_to_array[i] == 'tile' ){
				skill_array.push('磁磚');
			}

		}

		result[j].orderskill = skill_array;

	}

	return result;
	
};
