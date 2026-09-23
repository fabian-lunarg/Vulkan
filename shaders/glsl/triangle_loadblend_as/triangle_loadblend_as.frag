#version 460
#extension GL_EXT_ray_query : require

layout (location = 0) in vec3 inColor;
layout (location = 1) in vec3 inPos;

// Rebuilt every frame, in the same command buffer as the draws, with the occluder quad moved
layout (binding = 1) uniform accelerationStructureEXT topLevelAS;

layout (location = 0) out vec4 outFragColor;

void main()
{
	// Cast a ray through the triangle's plane at this fragment's object-space position.
	// Where it hits the occluder the colour is darkened, so the quad's position is visible.
	rayQueryEXT rayQuery;
	rayQueryInitializeEXT(rayQuery, topLevelAS, gl_RayFlagsTerminateOnFirstHitEXT, 0xFF,
		vec3(inPos.xy, -1.0), 0.0, vec3(0.0, 0.0, 1.0), 2.0);
	while (rayQueryProceedEXT(rayQuery)) {}
	bool occluded = rayQueryGetIntersectionTypeEXT(rayQuery, true) != gl_RayQueryCommittedIntersectionNoneEXT;

	outFragColor = vec4(occluded ? inColor * 0.25 : inColor, 1.0);
}
