Sidebar.Properties.Material = function ( signals ) {

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	container.add( new UI.Text().setText( 'MATERIAL' ).setColor( '#666' ) );

	container.add( new UI.Break(), new UI.Break() );

	container.add( new UI.Text().setText( 'Name' ).setColor( '#666' ) );

	var materialName = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialName );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Class' ).setColor( '#666' ) );

	var materialClass = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialClass );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Color' ).setColor( '#666' ) );

	var materialColor = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialColor );

	//

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material ) {

			container.setDisplay( 'block' );

			materialName.setText( object.material.name );
			materialClass.setText( getMaterialInstanceName( object.material ) );
			materialColor.setText( '#' + object.material.color.getHex().toString(16) );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	function getMaterialInstanceName( material ) {

		// TODO: Is there a way of doing this automatically?

		if ( material instanceof THREE.LineBasicMaterial ) return "LineBasicMaterial";
		if ( material instanceof THREE.MeshBasicMaterial ) return "MeshBasicMaterial";
		if ( material instanceof THREE.MeshDepthMaterial ) return "MeshDepthMaterial";
		if ( material instanceof THREE.MeshFaceMaterial ) return "MeshFaceMaterial";
		if ( material instanceof THREE.MeshLambertMaterial ) return "MeshLambertMaterial";
		if ( material instanceof THREE.MeshNormalMaterial ) return "MeshNormalMaterial";
		if ( material instanceof THREE.MeshPhongMaterial ) return "MeshPhongMaterial";
		if ( material instanceof THREE.ParticleBasicMaterial ) return "ParticleBasicMaterial";
		if ( material instanceof THREE.ParticleCanvasMaterial ) return "ParticleCanvasMaterial";
		if ( material instanceof THREE.ParticleDOMMaterial ) return "ParticleDOMMaterial";
		if ( material instanceof THREE.ShaderMaterial ) return "ShaderMaterial";
		if ( material instanceof THREE.Material ) return "Material";

	}

	return container;

}
