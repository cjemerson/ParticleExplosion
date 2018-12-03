// Charles Emerson
// Started: 14 Nov 2018
// Updated: 14 Nov 2018
// 
// For CS480 Research Project

function multMatrixAndVector(A : Matrix4, v : Vector4) : Vector4 {
    return new Vector4(
        A.m11 * v.x + A.m21 * v.y + A.m31 * v.z + A.m41 * v.w,
        A.m12 * v.x + A.m22 * v.y + A.m32 * v.z + A.m42 * v.w,
        A.m13 * v.x + A.m23 * v.y + A.m33 * v.z + A.m43 * v.w,
        A.m14 * v.x + A.m24 * v.y + A.m34 * v.z + A.m44 * v.w
    );
}

function get3dPoint(point2D : Vector2, width : number, height : number, viewMatrix : Matrix4, projectionMatrix : Matrix4) : Vector4 {

    let x : number = 2.0 * point2D.x / width - 1;
    let y : number = - 2.0 * point2D.y / height + 1;

    let viewProjectionInverse = (Matrix4.multiply(projectionMatrix, viewMatrix)).asInverse();
    let point3D : Vector4 = new Vector4(-x*viewMatrix.m34, -y*viewMatrix.m34, 0, 0);
    return multMatrixAndVector(viewProjectionInverse, point3D);
}

class Particle {
    public size: number = 0;
    public color: Vector3 = new Vector3();
    public origin: Vector3 = new Vector3();
    public position: Vector3 = new Vector3();
    public velocity: Vector3 = new Vector3();
    public life : number = 0;

    constructor() { }
};

class ParticleExplosionApp {
    renderingContext: FxRenderingContext;
    t0 = 0;
    t1 = 0;
    dt = 0;
    uiUpdateTime = 0;

    controls: MyControls;
    particles: Array<Particle> = new Array<Particle>(0);
    particleColor: Vector3 = new Vector3(0, 1, 0);
    surfaces: MyShape = new MyShape();
    orderOfMag: number = 3;
    uiText: HTMLElement | null = document.getElementById("uiText");
    frameCount: number = 0;
    lastFrameCountTime: number = 0;
    mouseClickPosition: Vector2 = new Vector2(-100, -100);
    slowMethod: number = 0;
    illustrationMethod : number = 2;
    uPointSize : WebGLUniformLocation | null = null;
    debug : boolean = false;
    pause : boolean = false;
    maxLife : number = 0;

    shaderProgram: WebGLProgram | null = null;

    aVertexLocation: number = 0;
    aColorLocation: number = 0;
    uModelViewMatrixLocation: WebGLUniformLocation | null = null;
    uProjectionMatrixLocation: WebGLUniformLocation | null = null;
    uColor: WebGLUniformLocation | null = null;
    uWorldMatrixLocation: WebGLUniformLocation | null = null;


    constructor(public width: number = 512, public height: number = 384) {
        hflog.logElement = "log";
        width = Math.floor(document.body.clientWidth);
        height = Math.floor(width * 3.0 / 4.0);
        this.renderingContext = new FxRenderingContext(width, height, "app");
        this.width = this.renderingContext.width;
        this.height = this.renderingContext.height;
        if (!this.renderingContext) {
            hflog.log('Unable to create new FxRenderingContext');
        }

        this.controls = new MyControls();
    }

    run(): void {
        this.init();
        this.mainloop(0);
    }

    private init(): void {
        this.loadInput();
        this.loadShaders();
    }


    
    private loadInput(): void {
        this.renderingContext.canvas.onclick = (e) => {
            // Global offset
            // hflog.log("Global: (" + (e.x) + ", " + e.y + ")");
            
            // // Canvas offset
            // hflog.log("Canvas: (" + (e.offsetX) + ", " + e.offsetY + ")");
            this.mouseClickPosition.x = e.offsetX
            this.mouseClickPosition.y = e.offsetY;
            
            
            // let x = e.offsetX / this.renderingContext.canvas.width  *  2 - 1;
            // let y = e.offsetY / this.renderingContext.canvas.height * -2 + 1;
            
            // hflog.log("webgl: (" + x + ", " + y + ")");

        }
    }

    private loadShaders(): void {
        let gl = this.renderingContext.gl;

        const vsSource = `#version 100
        #extension GL_OES_standard_derivatives: enable

        attribute vec4 aVertexPosition;
        attribute vec4 aColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uWorldMatrix;
        uniform float uPointSize;

        varying vec4 vColor;

        void main() {
            vec4 worldPosition = uWorldMatrix * aVertexPosition;
            vColor = aColor;
            gl_PointSize = uPointSize;

            gl_Position = uProjectionMatrix * uModelViewMatrix * worldPosition;
        }
        `;
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);

        const fsSource = `#version 100
        #extension GL_OES_standard_derivatives: enable

        precision mediump float;
        uniform vec3 uColor;

        varying vec4 vColor;

        void main() {
            gl_FragColor = vColor; //vec4(uColor, 1.0);
        }
        `;

        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        if (shaderProgram && vertexShader && fragmentShader) {
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                hflog.error("Unable to initialize shader program: " + gl.getProgramInfoLog(shaderProgram));
                this.shaderProgram = null;
            }

            this.shaderProgram = shaderProgram;

            this.aVertexLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            this.aColorLocation = gl.getAttribLocation(shaderProgram, 'aColor');
            this.uModelViewMatrixLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
            this.uProjectionMatrixLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
            this.uColor = gl.getUniformLocation(shaderProgram, "uColor");
            this.uWorldMatrixLocation = gl.getUniformLocation(shaderProgram, "uWorldMatrix");
            this.uPointSize = gl.getUniformLocation(shaderProgram, "uPointSize");
        }
    }

    private loadShader(type: number, source: string): null | WebGLShader {
        let gl = this.renderingContext.gl;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            hflog.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private mainloop(timestamp: number): void {
        let self = this;
        this.t0 = this.t1;
        this.t1 = timestamp / 1000.0;
        this.dt = this.t1 - this.t0;
        if (timestamp - this.uiUpdateTime > 150) {
            this.uiUpdateTime = timestamp;
            this.updateUI();
        }
        if (this.dt < 1.0 / 30) {
            setTimeout(() => { }, 17);
        }
        window.requestAnimationFrame((t: number) => {
            self.update();
            self.display();

            self.mainloop(t);
        });
    }

    private updateUI(): void {
        if (this.uiText) {
            let fps = this.frameCount / (this.t1 - this.lastFrameCountTime);
            this.frameCount = 0;
            this.lastFrameCountTime = this.t1;

            let desc = "Order of Magnitude Selected: " + this.orderOfMag;
            desc += "<br/>Rule Set: ";
            switch (this.slowMethod) {
                default:
                    this.slowMethod = 0;
                case 0:
                    desc += "Applying Constant Slow Factor";
                    break;
                case 1:
                    desc += "Applying Constant Negative Acceleration";
                    break;
                case 2:
                    desc += "Applying Constant Speed Factor";
                    break;
                case 3:
                    desc += "Applying Constant Positive Acceleration";
                    break;
                case 4:
                    desc += "Maintaining a Constant Speed";
                    break;
            }

            desc += "<br/>Representation: "
            switch (this.illustrationMethod) {
                default:
                    this.illustrationMethod = 0;
                case 0:
                    desc += "4-Vertex Squares - WebGL TRIANGLE_FAN";
                    break;
                case 1:
                    desc += "2-Vertex Line - WebGL LINES";
                    break;
                case 2:
                    desc += "1 Vertex Pixel - WebGL POINTS";
                    break;
            }


            let str: string = desc + "<br/>FPS: " + fps.toPrecision(3) + "<br/># Particles: " + this.particles.length + "<br/>Max Life of Particles: " + this.maxLife.toPrecision(3) + " seconds";

            if (this.uiText.innerHTML != str && (!this.debug || !this.pause)) {
                this.uiText.innerHTML = str;
            }
        }
    }

    increaseParticles(x : number = 0, y: number = 0, z : number = 0) {
        if (this.particles) {
            let numSpawned = Math.pow(10, this.orderOfMag);
            for (let i = 0; i < numSpawned; ++i) {
                let particle = new Particle();
                particle.color = this.particleColor;
                particle.position = new Vector3(x, y, z);
                particle.origin = particle.position;
                particle.size = 0.05;

                let speed = (this.slowMethod >= 2 && this.slowMethod != 4)? 0.1: 20.0;
                particle.velocity = Vector3.makeFromSpherical(2 * Math.PI * Math.random(), Math.PI * (Math.random() - 0.5)).mul(speed);

                this.particles.push(particle);
            }
        }
    }

    private update(): void {
        // The first time through will dynamically build key listener list
        // The list is physical keyboard keys, see KeyboardEvent.code documentation
        let keys = this.controls;

        
        if (keys.isKeyClick(["KeyQ"])) {
            this.illustrationMethod = 0;
        }        
        if (keys.isKeyClick(["KeyW"])) {
            this.illustrationMethod = 1;
        }
        if (keys.isKeyClick(["KeyE"])) {
            this.illustrationMethod = 2;
        }

        if (keys.isKeyClick(["KeyZ"])) {
            this.debug = !this.debug;
            this.pause = false;
        } 
        if (keys.isKeyClick(["KeyR"])) {
            this.pause = false;
            this.maxLife = 0;
            this.particles.splice(0);
        }

        if (this.debug && this.pause) {
            return;
        }

        /***** CAMERA / WORLD CONTROLS *****/
        if (this.particles) { // Remove Faraway particles and stopped particles
            const DIST = 40.0;
            const MIN_SPEED = 0.5;
            const ACCELERATION = 50.0;
            const SLOW_FACTOR = 0.0008;
            const SPEED_FACTOR = 1000.0;
            let slowFactor = Math.pow(SLOW_FACTOR, this.dt);
            let speedFactor = Math.pow(SPEED_FACTOR, this.dt);
            let accelSlower = - ACCELERATION * this.dt;
            let accelFaster = ACCELERATION * this.dt;
            let maxLife = 0;
            for (let i = 0; i < this.particles.length; ++i) {
                let e = this.particles[i];

                this.particles[i].life += this.dt;

                if (e.life > maxLife) {
                    maxLife = e.life;
                }

                if (e.position.length() >= DIST) {
                    if (this.debug) {
                        this.pause = true;
                        break;
                    }
                    this.particles.splice(i, 1);
                    continue;
                }


                this.particles[i].position = Vector3.add(e.position, e.velocity.mul(this.dt));
                if (this.slowMethod < 2) {
                    if (e.velocity.length() < MIN_SPEED) {
                        if (this.debug) {
                            this.pause = true;
                            break;
                        }
                        this.particles.splice(i, 1);
                        continue;
                    }
                    if (this.slowMethod) {
                        // Apply acceleration
                        let deltaV = this.particles[i].velocity.norm().mul(accelSlower);
                        this.particles[i].velocity = this.particles[i].velocity.add(deltaV);

                        let local_position = Vector3.sub(this.particles[i].position, this.particles[i].origin);
                        if (Vector3.dot(local_position, this.particles[i].velocity) < 0) {
                            if (this.debug) {
                                this.pause = true;
                                break;
                            }
                            this.particles.splice(i, 1);
                        }
                    } else {
                        this.particles[i].velocity = this.particles[i].velocity.mul(slowFactor);
                    }
                } else {
                    if (this.slowMethod == 2) {
                        this.particles[i].velocity = this.particles[i].velocity.mul(speedFactor);
                    } else if (this.slowMethod == 3) {
                        // Apply acceleration
                        let deltaV = this.particles[i].velocity.norm().mul(accelFaster);
                        this.particles[i].velocity = this.particles[i].velocity.add(deltaV);
                    } else { // this.slowMethod == 4
                        // Maintain Speed
                    }
                }
            }

            if (this.maxLife < maxLife) {
                this.maxLife = maxLife;
            }
        }

        if (keys.isKeyClick(["Tab"])) {
            // Swap between Constant Negative Acceleration or Slow Factor
            this.slowMethod = (this.slowMethod != 0)? 0 : 1;
        }

        if (keys.isKeyClick(["KeyT"])) {
            // Iterate between all slow methods
            this.slowMethod = (this.slowMethod + 1) % 5;
        }

        if (keys.isKeyClick(["Digit1"])) {
            this.orderOfMag = 0;
        }
        if (keys.isKeyClick(["Digit2"])) {
            this.orderOfMag = 1;
        }
        if (keys.isKeyClick(["Digit3"])) {
            this.orderOfMag = 2;
        }
        if (keys.isKeyClick(["Digit4"])) {
            this.orderOfMag = 3;
        }
        if (keys.isKeyClick(["Digit5"])) {
            this.orderOfMag = 4;
        }
        if (keys.isKeyClick(["Digit6"])) {
            this.orderOfMag = 5;
        }

        if (keys.isKeyDown(["ShiftLeft", "ShiftRight"]) || keys.isKeyClick(["Space"])) {

            this.particleColor = getRandomBrightColor();
        }
        if (keys.isKeyDown(["Space"]) || keys.isKeyClick(["KeyA"]) ) {
            this.increaseParticles();
        }

        ++this.frameCount;
    }

    private display(): void {
        let gl = this.renderingContext.gl;

        let sine = Math.abs(Math.sin(this.t1));
        if (this.debug) {
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
        } else {
            gl.clearColor(sine * 0.1, sine * 0.1, sine * 0.3, 1.0);
        }
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let p = Matrix4.makePerspectiveX(45.0, this.renderingContext.aspectRatio, 0.1, 1000.0);
        let c = Matrix4.makeTranslation(0.0, 0.0, -10.0);

        gl.useProgram(this.shaderProgram);
        if (this.uProjectionMatrixLocation)
            gl.uniformMatrix4fv(this.uProjectionMatrixLocation, false, p.toColMajorArray());
        if (this.uModelViewMatrixLocation)
            gl.uniformMatrix4fv(this.uModelViewMatrixLocation, false, c.toColMajorArray());

        let color = new Vector3(0.0, 1.0, 0.0);
        if (this.uColor)
            gl.uniform3fv(this.uColor, color.toFloat32Array());

        let w = Matrix4.makeIdentity();
        gl.useProgram(this.shaderProgram);

        // The following is code to draw each particle individually. (**Very slow**)
        // if (this.particles) {
        //     this.particles.forEach((e) => {
        //         let scale = e.size;
        //         w = Matrix4.makeScale(scale, scale, scale);
        //         w.Translate(e.position.x, e.position.y, e.position.z);
        //         gl.uniformMatrix4fv(this.uWorldMatrixLocation, false, w.toColMajorArray());
        //         gl.uniform3fv(this.uColor, e.color.toFloat32Array());
        //         this.surfaces.draw(gl, this.aVertexLocation, this.aColorLocation);
        //     });
        // }

        if (this.mouseClickPosition.x >= 0) {
            let point = get3dPoint(this.mouseClickPosition, this.renderingContext.width, this.renderingContext.height, c, p);

            this.particleColor = getRandomBrightColor();

            if (this.particles) {
                let numSpawned = Math.pow(10, this.orderOfMag);
                for (let i = 0; i < numSpawned; ++i) {
                    let particle = new Particle();
                    particle.color = getRandomBrightColor();
                    particle.position = point.toVector3();
                    particle.origin = particle.position;
                    particle.size = 0.05;

                    let speed = (this.slowMethod >= 2 && this.slowMethod != 4)? 0.1: 20.0;
                    particle.velocity = Vector3.makeFromSpherical(2 * Math.PI * Math.random(), Math.PI * (Math.random() - 0.5)).mul(speed);

                    this.particles.push(particle);
                }
            }

            this.mouseClickPosition.reset(-100, -100);
        }

        // Draw all of the particles 
        let surface = new MyShape();

        if (this.particles) {
            let black = new Vector3();
            if (this.illustrationMethod == 0) {
                this.particles.forEach((e) => {
                    let scale = e.size;
                    let pos = e.position;
                    let color = (this.debug)? black : e.color;
                    surface.newSurface(gl.TRIANGLE_FAN);
                    surface.color3(color);
                    surface.vertex(-0.5*scale + pos.x, -0.5*scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(0.5*scale + pos.x, -0.5*scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(0.5*scale + pos.x, 0.5*scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(-0.5*scale + pos.x, 0.5*scale + pos.y, pos.z);
                });
            } else if (this.illustrationMethod == 1){
                this.particles.forEach((e) => {
                    let origin = e.origin;
                    let pos = e.position;
                    let color = (this.debug)? black : e.color;
                    surface.newSurface(gl.LINES);
                    surface.color(color.r, color.g, color.b);
                    surface.vertex3(origin);
                    surface.color(color.r, color.g, color.b);
                    surface.vertex3(pos);
                });
            } else if (this.illustrationMethod == 2){
                this.particles.forEach((e) => {
                    let pos = e.position;
                    let color = (this.debug)? black : e.color;
                    
                    surface.newSurface(gl.POINTS);
                    surface.color(color.r, color.g, color.b);
                    surface.vertex3(pos);
                });
                gl.uniform1f(this.uPointSize, 2.0);
            }
        }

        gl.uniformMatrix4fv(this.uWorldMatrixLocation, false, w.toColMajorArray());      
        surface.draw(gl, this.aVertexLocation, this.aColorLocation);
    }
}