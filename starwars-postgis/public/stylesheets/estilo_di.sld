<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0"
                       xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
                       xmlns="http://www.opengis.net/sld"
                       xmlns:ogc="http://www.opengis.net/ogc"
                       xmlns:xlink="http://www.w3.org/1999/xlink"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>drought_raster</Name>
    <UserStyle>
      <Title>Drought Raster Style</Title>
      <Abstract>SLD for Drought Raster</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <RasterSymbolizer>
            <ColorMap>
              <ColorMapEntry color="#8c510a" quantity="2" label="0.00 - 2.00"/>
              <ColorMapEntry color="#d8b365" quantity="5" label="2.01 - 5.00"/>
              <ColorMapEntry color="#f6e8c3" quantity="10" label="5.01 - 10.00"/>
              <ColorMapEntry color="#f5f5f5" quantity="20" label="10.01 - 20.00"/>
              <ColorMapEntry color="#d9ef8b" quantity="30" label="20.01 - 30.00"/>
              <ColorMapEntry color="#91cf60" quantity="70" label="30.01 - 70.00"/>
              <ColorMapEntry color="#1a9850" quantity="80" label="70.01 - 80.00"/>
              <ColorMapEntry color="#a6d96a" quantity="90" label="80.01 - 90.00"/>
              <ColorMapEntry color="#66bd63" quantity="95" label="90.01 - 95.00"/>
              <ColorMapEntry color="#1a9850" quantity="98" label="95.01 - 98.00"/>
              <ColorMapEntry color="#006837" quantity="100" label="98.01 - 100.00"/>
            </ColorMap>
          </RasterSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>