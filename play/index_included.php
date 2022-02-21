<?php
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
?> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"  
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta name="description" content="PLAY GRAND THEFT AUTO 2.0">
		<meta name="keywords" content="gta,gg,gtagg,webgl,gta2,browser,game"> 
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		
		<meta http-equiv="cache-control" content="max-age=0" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
		<meta http-equiv="pragma" content="no-cache" />

		<link href='http://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' type='text/css'>
				
		<link rel="stylesheet" href="play/play.css" type="text/css">
		
		<script src="jquery-2.1.3.min.js"></script>

		<script src="three.js-master/build/three.min.js"></script>

		<!--<script src="three.js-master/examples/js/libs/dat.gui.min.js"></script>
		<script src="three.js-master/examples/js/libs/stats.min.js"></script>-->

		<script src="https://rawgit.com/flozz/StackBlur/master/dist/stackblur.js"></script>
		
		<script src="play/js/box2d.min.js"></script>

		<?php
		$time = time();
		$dev = isset( $_GET['dev'] );
		$mode = ($dev) ? 'DEV MODE' : '';
			if ( ! $dev )
				echo "
		<script src=\"play/gtagg.min.js?ver=$time\"></script>";
			else
				echo '
		<link rel="stylesheet" href="play/Ed.css" type="text/css">
		<script src="play/js/gta2.0.js"></script>
		<script src="play/js/hotline.js"></script>
		<script src="play/js/util.js"></script>
		<script src="play/js/tools.js"></script>
		<script src="play/js/engine.js"></script>
		<script src="play/js/net.js"></script>
		<script src="play/js/sprite.js"></script>
		<script src="play/js/entity.js"></script>
		<script src="play/js/decal.js"></script>
		<script src="play/js/man.js"></script>
		<script src="play/js/player.js"></script>
		<script src="play/js/settings.js"></script>
		<script src="play/js/tour.js"></script>
		<script src="play/js/car.js"></script>
		<script src="play/js/block.js"></script>
		<script src="play/js/surface.js"></script>
		<script src="play/js/neon.js"></script>
		<script src="play/js/light.js"></script>
		<script src="play/js/pickup.js"></script>
		<script src="play/js/door.js"></script>
		<script src="play/js/interior.js"></script>
		<script src="play/js/activator.js"></script>
		<script src="play/js/map.js"></script>
		<script src="play/js/inventory.js"></script>
		<script src="play/js/minimap.js"></script>
		<script src="play/js/chunk.js"></script>
		<script src="play/js/dev.js"></script>
		<script src="play/js/devel.js"></script>
		';
		?>

		<title>GTA2.0a <?php echo $mode; ?></title>

		<link rel="manifest" href="manifest.json">

	</head>
	
	<body>
		<?php if ( $dev ) echo '<dev></dev>';?>
		
		<div id="container">
			<!--If you see this, WebGL may not be working properly. Or I messed up the code.-->
		</div>
		<div id="hud"></div>
		<div id="overlay">
			
			<div id="debug"></div>
			<div id="bubbles"></div>
			<div id="gun"></div>
			<div id="pickups"></div>
			
			<div id="links"></div>
			<!-- <div id="links"><a href="index_devel.php">links</a></div> -->
		</div>

		<script id="fairyFragmentShader" type="x-shader/x-vertex">
		#define FAIRY
		#define PHONG

		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform vec3 specular;
		uniform float shininess;
		uniform float opacity;

		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <uv2_pars_fragment>
		#include <map_pars_fragment>

		uniform sampler2D soft;

		#ifdef MAN

			uniform sampler2D skin;
			uniform sampler2D feet;
			uniform sampler2D legs;
			uniform sampler2D body;
			uniform sampler2D hair;
			uniform sampler2D gun;

		#endif

		#ifdef CAR

			uniform sampler2D car;

		#endif

		#include <alphamap_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <envmap_pars_fragment>
		#include <gradientmap_pars_fragment>
		#include <fog_pars_fragment>
		#include <bsdfs>
		#include <lights_pars>
		#include <lights_phong_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <bumpmap_pars_fragment>
		#include <normalmap_pars_fragment>
		#include <specularmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>


		void main() {

			#include <clipping_planes_fragment>

			vec4 diffuseColor = vec4( diffuse, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = emissive;

			#include <logdepthbuf_fragment>
			//#include <map_fragment>

			float mask = texture2D( map, vUv ).a;

			diffuseColor *= texture2D( soft, vUv );
			diffuseColor.rgb *= 0.0;
			diffuseColor.a /= 2.5; // detensify
			diffuseColor.rgba *= 1.0-mask; // cut out

			vec4 texelColor = vec4( 0. );

			#ifdef MAN

				texelColor += texture2D( skin, vUv );
				texelColor += texture2D( feet, vUv );
				texelColor += texture2D( legs, vUv );
				texelColor += texture2D( body, vUv );
				texelColor += texture2D( hair, vUv );
				texelColor += texture2D( gun, vUv );

			#endif

			#ifdef CAR

				texelColor += texture2D( map, vUv );

			#endif

			texelColor = mapTexelToLinear( texelColor );

			diffuseColor.rgb = texelColor.rgb;

			if (mask==1.0) {
				diffuseColor.a = 1.0; // invert cut out
			}

			#include <color_fragment>
			//#include <alphamap_fragment>
			//#include <alphatest_fragment>
			#include <specularmap_fragment>
			#include <normal_fragment>
			//#include <emissivemap_fragment>

			// accumulation
			#include <lights_phong_fragment>
			#include <lights_template>

			// modulation
			#include <aomap_fragment>

			vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

			#include <envmap_fragment>

			//diffuseColor.a = .25;
			
			gl_FragColor = vec4( outgoingLight, diffuseColor.a );


			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>

		}
		</script>
	</body>
</html>