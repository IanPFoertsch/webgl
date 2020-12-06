


float Circle(vec2 uv, float radius, vec2 origin) {
	float len = length(origin - uv); // length of the vector from the origin to current xy pixel
    //smoothstep(a,b,c)
    //a = inner bound: anything less will be 0
    //b = outer bound: anything more will be 1
    //c = our current value to return a smoothstep for
    //smoothstep if our current length of vector to origin is between the radius &
    float color = smoothstep(radius, radius - .01, len);
    return color;
}

float Crescent(vec2 uv, float radius, vec2 origin) {
	vec2 negativeOrigin = vec2(origin.x, origin.y + 0.1);
    vec2 positiveOrigin = vec2(origin.x, origin.y - 0.1);

    float negativeCircle = Circle(uv, radius, negativeOrigin);
    float positiveCircle = Circle(uv, radius, positiveOrigin);

    return max((positiveCircle - negativeCircle), 0.0);

    //return 1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv -= .5; // remap the coordinate system to be centered at 0.0, 0.0 rather than originating from lower left

    uv.x *= iResolution.x/iResolution.y; // normalize xy coordinates


    //"length" of UV coordinate = distance from origin - 0.0, 0.0
    // "length(coordinate)" is a built-in glsl function determining length of vector
    float radius = 0.4;

    vec2 origin = vec2(0., 0.0);

    float color = Circle(uv, radius, origin);
    float rightEye = Circle(uv, 0.1, vec2(0.15,0.15));
    float leftEye = Circle(uv, 0.1, vec2(-0.15,0.15));

    float crescent = Crescent(uv, 0.2, vec2(-0.0, -0.0));

 	fragColor = vec4(vec2(color) - (vec2(rightEye) + vec2(leftEye) +  crescent), 0.0, 0.0);
}
