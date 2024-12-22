uniform float u_time;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec2 u_speed;
uniform float u_aspect;
uniform float u_size;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    // Adjust UV for aspect ratio and create flowing motion
    vec2 moving_uv = uv * vec2(u_aspect, 1.0) * u_size;
    
    // Create multiple flowing layers
    float flow1 = sin(moving_uv.x + moving_uv.y * 0.5 + u_time * 2.0);
    float flow2 = cos(moving_uv.x * 0.7 - moving_uv.y + u_time * 1.5);
    float flow3 = sin(moving_uv.x * 0.5 + moving_uv.y * 0.8 + u_time * 3.0);
    
    // Combine flows with different speeds
    float pattern = (flow1 + flow2 + flow3) * 0.3 + 0.5;
    
    // Add grid effect
    vec2 grid = fract(moving_uv - 0.5);
    float gridLines = 1.0 - smoothstep(0.0, 0.05, 
        min(min(grid.x, grid.y), min(1.0 - grid.x, 1.0 - grid.y)));
    
    // Create pulsing effect
    float pulse = sin(u_time * 3.0) * 0.1 + 0.9;
    
    // Convert colors
    vec4 col1 = vec4(u_color1 / 255.0, 1.0);
    vec4 col2 = vec4(u_color2 / 255.0, 1.0);
    
    // Combine everything with motion
    vec4 flowColor = mix(col2, col1, pattern * pulse);
    return flowColor + gridLines * 0.1;
}