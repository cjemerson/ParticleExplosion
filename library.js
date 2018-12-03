"use strict";
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(multiplicand) {
        return new Vector2(this.x * multiplicand, this.y * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector2();
        return new Vector2(this.x / divisor, this.y / divisor);
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, 0.0);
    }
    toVector4() {
        return new Vector4(this.x, this.y, 0.0, 0.0);
    }
    project() {
        return this.x / this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector2();
        else
            len = Math.sqrt(len);
        return new Vector2(this.x / len, this.y / len);
    }
    static make(x, y) {
        return new Vector2(x, y);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Vector3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get r() { return this.x; }
    get g() { return this.y; }
    get b() { return this.z; }
    set r(r) { this.x = r; }
    set g(g) { this.g = g; }
    set b(b) { this.z = b; }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    reset(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    static makeFromSpherical(theta, phi) {
        return new Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), -Math.cos(phi) * Math.sin(theta));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // theta is inclination away from positive y-axis, and phi is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalISO(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(thetaInRadians) * Math.cos(phiInRadians), rho * Math.cos(thetaInRadians), rho * Math.sin(thetaInRadians) * Math.sin(phiInRadians));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // phi is inclination away from positive y-axis, and theta is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalMath(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(phiInRadians) * Math.sin(thetaInRadians), rho * Math.cos(phiInRadians), rho * Math.sin(phiInRadians) * Math.cos(thetaInRadians));
    }
    // theta represents angle from +x axis on xz plane going counterclockwise
    // phi represents angle from xz plane going towards +y axis
    setFromSpherical(theta, phi) {
        this.x = Math.cos(theta) * Math.cos(phi);
        this.y = Math.sin(phi);
        this.z = -Math.sin(theta) * Math.cos(phi);
        return this;
    }
    get theta() {
        return Math.atan2(this.x, -this.z) + ((this.z <= 0.0) ? 0.0 : 2.0 * Math.PI);
    }
    get phi() {
        return Math.asin(this.y);
    }
    static make(x, y, z) {
        return new Vector3(x, y, z);
    }
    static makeUnit(x, y, z) {
        return (new Vector3(x, y, z)).norm();
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(multiplicand) {
        return new Vector3(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }
    neg() {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    // multiplicative inverse (1/x)
    reciprocal() {
        return new Vector3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
    }
    pow(power) {
        return new Vector3(Math.pow(this.x, power), Math.pow(this.y, power), Math.pow(this.z, power));
    }
    compdiv(divisor) {
        return new Vector3(this.x / divisor.x, this.y / divisor.y, this.z / divisor.z);
    }
    compmul(multiplicand) {
        return new Vector3(this.x * multiplicand.x, this.y * multiplicand.y, this.z * multiplicand.z);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector4(w) {
        return new Vector4(this.x, this.y, this.z, w);
    }
    project() {
        return new Vector2(this.x / this.z, this.y / this.z);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    normalize() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
    get(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return 0.0;
    }
    set(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                return;
            case 1:
                this.y = value;
                return;
            case 2:
                this.z = value;
                return;
        }
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static cross(a, b) {
        return new Vector3(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mul(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static div(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Vector4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
    reset(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    add(v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }
    sub(v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }
    mul(multiplicand) {
        return new Vector4(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand, this.w * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector4();
        return new Vector4(this.x / divisor, this.y / divisor, this.z / divisor, this.w / divisor);
    }
    neg() {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z, this.w]);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }
    project() {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector4();
        else
            len = Math.sqrt(len);
        return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0, 0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
            v.z /= len;
            v.w /= len;
        }
        return v;
    }
    static make(x, y, z, w) {
        return new Vector4(x, y, z, w);
    }
    static makeUnit(x, y, z, w) {
        return (new Vector4(x, y, z, w)).norm();
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts" />
class Matrix2 {
    constructor(m11, m21, m12, m22) {
        this.m11 = m11;
        this.m21 = m21;
        this.m12 = m12;
        this.m22 = m22;
    }
    static makeIdentity() {
        return new Matrix2(1, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix2(0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m12, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static makeRowMajor(m11, m12, m21, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[2], v[1], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[1], v[2], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static makeScale(x, y) {
        return Matrix2.makeRowMajor(x, 0, 0, y);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        return Matrix2.makeRowMajor(c, -s, s, c);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21,
            this.m12, this.m22
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12,
            this.m21, this.m22
        ];
    }
    static multiply(m1, m2) {
        return new Matrix2(m1.m11 * m2.m11 + m1.m21 * m2.m12, m1.m11 * m2.m21 + m1.m21 * m2.m22, m1.m12 * m2.m11 + m1.m22 * m2.m12, m1.m12 * m2.m21 + m1.m22 * m2.m22);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m12 = m.m12;
        this.m22 = m.m22;
        return this;
    }
    concat(m) {
        this.copy(Matrix2.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector2(this.m11 * v.x + this.m12 * v.y, this.m21 * v.x + this.m22 * v.y);
    }
    asInverse() {
        var tmpD = 1.0 / (this.m11 * this.m22 - this.m12 * this.m21);
        return Matrix2.makeRowMajor(this.m22 * tmpD, -this.m12 * tmpD, -this.m21 * tmpD, this.m11 * tmpD);
    }
    asTranspose() {
        return Matrix2.makeRowMajor(this.m11, this.m21, this.m12, this.m22);
    }
} // class Matrix2
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="GTE.ts"/>
class Matrix3 {
    constructor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
    }
    static makeIdentity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static makeRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[3], v[6], v[1], v[4], v[7], v[2], v[5], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeScale(x, y, z) {
        return Matrix3.makeRowMajor(x, 0, 0, 0, y, 0, 0, 0, z);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix3.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix3.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix3.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix3.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix3.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix3.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix3.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }
    static multiply(m1, m2) {
        return new Matrix3(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33);
    }
    LoadIdentity() {
        return this.copy(Matrix3.makeIdentity());
    }
    MultMatrix(m) {
        return this.copy(Matrix3.multiply(this, m));
    }
    LoadColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    LoadRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    toMatrix4() {
        return Matrix4.makeRowMajor(this.m11, this.m12, this.m13, 0.0, this.m21, this.m22, this.m23, 0.0, this.m31, this.m32, this.m33, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        return this;
    }
    clone() {
        return Matrix3.makeRowMajor(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
    concat(m) {
        this.copy(Matrix3.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    }
    asInverse() {
        var tmpA = this.m22 * this.m33 - this.m23 * this.m32;
        var tmpB = this.m21 * this.m32 - this.m22 * this.m31;
        var tmpC = this.m23 * this.m31 - this.m21 * this.m33;
        var tmpD = 1.0 / (this.m11 * tmpA + this.m12 * tmpC + this.m13 * tmpB);
        return new Matrix3(tmpA * tmpD, (this.m13 * this.m32 - this.m12 * this.m33) * tmpD, (this.m12 * this.m23 - this.m13 * this.m22) * tmpD, tmpC * tmpD, (this.m11 * this.m33 - this.m13 * this.m31) * tmpD, (this.m13 * this.m21 - this.m11 * this.m23) * tmpD, tmpB * tmpD, (this.m12 * this.m31 - this.m11 * this.m32) * tmpD, (this.m11 * this.m22 - this.m12 * this.m21) * tmpD);
    }
    asTranspose() {
        return new Matrix3(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
} // class Matrix3
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
///<reference path="GTE.ts"/>
class Matrix4 {
    constructor(m11 = 1, m21 = 0, m31 = 0, m41 = 0, m12 = 0, m22 = 1, m32 = 0, m42 = 0, m13 = 0, m23 = 0, m33 = 1, m43 = 0, m14 = 0, m24 = 0, m34 = 0, m44 = 1) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m41 = m41;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m42 = m42;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
        this.m43 = m43;
        this.m14 = m14;
        this.m24 = m24;
        this.m34 = m34;
        this.m44 = m44;
    }
    copy(m) {
        return this.LoadMatrix(m);
    }
    clone() {
        return new Matrix4(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
    }
    row(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m12, this.m13, this.m14);
            case 1: return new Vector4(this.m21, this.m22, this.m23, this.m24);
            case 2: return new Vector4(this.m31, this.m32, this.m33, this.m34);
            case 3: return new Vector4(this.m41, this.m42, this.m43, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    col(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m21, this.m31, this.m41);
            case 1: return new Vector4(this.m12, this.m22, this.m32, this.m42);
            case 2: return new Vector4(this.m13, this.m23, this.m33, this.m43);
            case 3: return new Vector4(this.m14, this.m24, this.m34, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    row3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m12, this.m13);
            case 1: return new Vector3(this.m21, this.m22, this.m23);
            case 2: return new Vector3(this.m31, this.m32, this.m33);
            case 3: return new Vector3(this.m41, this.m42, this.m43);
        }
        return new Vector3(0, 0, 0);
    }
    col3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m21, this.m31);
            case 1: return new Vector3(this.m12, this.m22, this.m32);
            case 2: return new Vector3(this.m13, this.m23, this.m33);
            case 3: return new Vector3(this.m14, this.m24, this.m34);
        }
        return new Vector3(0, 0, 0);
    }
    diag3() {
        return new Vector3(this.m11, this.m22, this.m33);
    }
    LoadRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadIdentity() {
        return this.LoadMatrix(Matrix4.makeIdentity());
    }
    Translate(x, y, z) {
        return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
    }
    Rotate(angleInDegrees, x, y, z) {
        return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
    }
    Scale(sx, sy, sz) {
        return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
    }
    LookAt(eye, center, up) {
        return this.MultMatrix(Matrix4.makeLookAt2(eye, center, up));
    }
    Frustum(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
    }
    Ortho(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
    }
    Ortho2D(left, right, bottom, top) {
        return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
    }
    PerspectiveX(fovx, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
    }
    PerspectiveY(fovy, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
    }
    ShadowBias() {
        return this.MultMatrix(Matrix4.makeShadowBias());
    }
    CubeFaceMatrix(face) {
        return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
    }
    static makeIdentity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static makeRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeTranslation(x, y, z) {
        return Matrix4.makeRowMajor(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    static makeScale(x, y, z) {
        return Matrix4.makeRowMajor(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix4.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    static makeOrtho(left, right, bottom, top, near, far) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return Matrix4.makeRowMajor(2 / (right - left), 0, 0, tx, 0, 2 / (top - bottom), 0, ty, 0, 0, -2 / (far - near), tz, 0, 0, 0, 1);
    }
    static makeOrtho2D(left, right, bottom, top) {
        return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
    }
    static makeFrustum(left, right, bottom, top, near, far) {
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(far + near) / (far - near);
        var D = -2 * far * near / (far - near);
        return Matrix4.makeRowMajor(2 * near / (right - left), 0, A, 0, 0, 2 * near / (top - bottom), B, 0, 0, 0, C, D, 0, 0, -1, 0);
    }
    static makePerspectiveY(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(Math.PI * fovy / 360.0);
        return Matrix4.makeRowMajor(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makePerspectiveX(fovx, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);
        return Matrix4.makeRowMajor(f, 0, 0, 0, 0, f * aspect, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makeLookAt(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1), Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z));
    }
    static makeLookAt2(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z), Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1));
    }
    static makeShadowBias() {
        return Matrix4.makeRowMajor(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix4.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    toColMajorArray() {
        return [
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        ];
    }
    toRowMajorArray() {
        return [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44
        ];
    }
    static multiply3(a, b, c) {
        return Matrix4.multiply(a, Matrix4.multiply(b, c));
    }
    static multiply(a, b) {
        return new Matrix4(a.m11 * b.m11 + a.m21 * b.m12 + a.m31 * b.m13 + a.m41 * b.m14, a.m11 * b.m21 + a.m21 * b.m22 + a.m31 * b.m23 + a.m41 * b.m24, a.m11 * b.m31 + a.m21 * b.m32 + a.m31 * b.m33 + a.m41 * b.m34, a.m11 * b.m41 + a.m21 * b.m42 + a.m31 * b.m43 + a.m41 * b.m44, a.m12 * b.m11 + a.m22 * b.m12 + a.m32 * b.m13 + a.m42 * b.m14, a.m12 * b.m21 + a.m22 * b.m22 + a.m32 * b.m23 + a.m42 * b.m24, a.m12 * b.m31 + a.m22 * b.m32 + a.m32 * b.m33 + a.m42 * b.m34, a.m12 * b.m41 + a.m22 * b.m42 + a.m32 * b.m43 + a.m42 * b.m44, a.m13 * b.m11 + a.m23 * b.m12 + a.m33 * b.m13 + a.m43 * b.m14, a.m13 * b.m21 + a.m23 * b.m22 + a.m33 * b.m23 + a.m43 * b.m24, a.m13 * b.m31 + a.m23 * b.m32 + a.m33 * b.m33 + a.m43 * b.m34, a.m13 * b.m41 + a.m23 * b.m42 + a.m33 * b.m43 + a.m43 * b.m44, a.m14 * b.m11 + a.m24 * b.m12 + a.m34 * b.m13 + a.m44 * b.m14, a.m14 * b.m21 + a.m24 * b.m22 + a.m34 * b.m23 + a.m44 * b.m24, a.m14 * b.m31 + a.m24 * b.m32 + a.m34 * b.m33 + a.m44 * b.m34, a.m14 * b.m41 + a.m24 * b.m42 + a.m34 * b.m43 + a.m44 * b.m44);
    }
    LoadMatrix(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m41 = m.m41;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m42 = m.m42;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        this.m43 = m.m43;
        this.m14 = m.m14;
        this.m24 = m.m24;
        this.m34 = m.m34;
        this.m44 = m.m44;
        return this;
    }
    MultMatrix(m) {
        this.LoadMatrix(Matrix4.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector4(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w, this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w);
    }
    asInverse() {
        var tmp1 = this.m32 * this.m43 - this.m33 * this.m42;
        var tmp2 = this.m32 * this.m44 - this.m34 * this.m42;
        var tmp3 = this.m33 * this.m44 - this.m34 * this.m43;
        var tmp4 = this.m22 * tmp3 - this.m23 * tmp2 + this.m24 * tmp1;
        var tmp5 = this.m31 * this.m42 - this.m32 * this.m41;
        var tmp6 = this.m31 * this.m43 - this.m33 * this.m41;
        var tmp7 = -this.m21 * tmp1 + this.m22 * tmp6 - this.m23 * tmp5;
        var tmp8 = this.m31 * this.m44 - this.m34 * this.m41;
        var tmp9 = this.m21 * tmp2 - this.m22 * tmp8 + this.m24 * tmp5;
        var tmp10 = -this.m21 * tmp3 + this.m23 * tmp8 - this.m24 * tmp6;
        var tmp11 = 1 / (this.m11 * tmp4 + this.m12 * tmp10 + this.m13 * tmp9 + this.m14 * tmp7);
        var tmp12 = this.m22 * this.m43 - this.m23 * this.m42;
        var tmp13 = this.m22 * this.m44 - this.m24 * this.m42;
        var tmp14 = this.m23 * this.m44 - this.m24 * this.m43;
        var tmp15 = this.m22 * this.m33 - this.m23 * this.m32;
        var tmp16 = this.m22 * this.m34 - this.m24 * this.m32;
        var tmp17 = this.m23 * this.m34 - this.m24 * this.m33;
        var tmp18 = this.m21 * this.m43 - this.m23 * this.m41;
        var tmp19 = this.m21 * this.m44 - this.m24 * this.m41;
        var tmp20 = this.m21 * this.m33 - this.m23 * this.m31;
        var tmp21 = this.m21 * this.m34 - this.m24 * this.m31;
        var tmp22 = this.m21 * this.m42 - this.m22 * this.m41;
        var tmp23 = this.m21 * this.m32 - this.m22 * this.m31;
        return new Matrix4(tmp4 * tmp11, (-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11, (this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11, (-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11, tmp10 * tmp11, (this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11, (-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11, (this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11, tmp9 * tmp11, (-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11, (this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11, (-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11, tmp7 * tmp11, (this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11, (-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11, (this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11);
    }
    asTranspose() {
        return new Matrix4(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
    }
} // class Matrix4
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
var GTE;
(function (GTE) {
    function clamp(x, a, b) {
        return x < a ? a : x > b ? b : x;
    }
    GTE.clamp = clamp;
    // 0 <= mix <= 1
    function lerp(a, b, mix) {
        return mix * a + (1 - mix) * b;
    }
    GTE.lerp = lerp;
    function distancePointLine2(point, linePoint1, linePoint2) {
        let v = linePoint2.sub(linePoint1);
        let d = v.length();
        let n = Math.abs(v.y * point.x - v.x * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
        if (d != 0.0)
            return n / d;
        return 1e30;
    }
    GTE.distancePointLine2 = distancePointLine2;
    function gaussian(x, center, sigma) {
        let t = (x - center) / sigma;
        return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
        //return 1 / (Math.sqrt(2.0 * sigma * sigma * Math.PI)) * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
    }
    GTE.gaussian = gaussian;
    function min3(a, b, c) {
        return Math.min(Math.min(a, b), c);
    }
    GTE.min3 = min3;
    function max3(a, b, c) {
        return Math.max(Math.max(a, b), c);
    }
    GTE.max3 = max3;
})(GTE || (GTE = {}));
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="../gte/GTE.ts" />
/// <reference path="Utils.ts" />
/// <reference path="RenderConfig.ts" />
/// // <reference path="Scenegraph.ts" />
/// // <reference path="IndexedGeometryMesh.ts" />
/// // <reference path="Texture.ts" />
/// // <reference path="MaterialLibrary.ts" />
class FxRenderingContext {
    constructor(width = 512, height = 384, id = "") {
        this.width = width;
        this.height = height;
        this.id = id;
        this.enabledExtensions = new Map();
        this.divElement_ = null;
        this.canvasElement_ = null;
        this.aspectRatio = 1.0;
        this._visible = false;
        if (id && id.length > 0) {
            let e = document.getElementById(id);
            if (e) {
                this.divElement_ = e;
            }
            else {
                e = document.createElement("div");
                e.id = id;
                document.body.appendChild(e);
                this.divElement_ = e;
            }
        }
        if (!this.divElement_) {
            this.divElement_ = document.createElement("div");
            this.divElement_.id = "fluxions";
        }
        this.canvasElement_ = document.createElement("canvas");
        this.canvasElement_.width = width;
        this.canvasElement_.height = height;
        if (this.canvasElement_) {
            let gl = this.canvasElement_.getContext("webgl");
            if (!gl) {
                gl = this.canvasElement_.getContext("experimental-webgl");
            }
            if (!gl) {
                this.divElement_.innerText = "WebGL not supported.";
                throw "Unable to create rendering context!";
            }
            else {
                this.gl = gl;
                this.divElement_.appendChild(this.canvasElement_);
                this.divElement_.align = "center";
                this.aspectRatio = width / height;
                let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    let vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                    let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    hflog.log(vendor);
                    hflog.log(renderer);
                }
            }
        }
        else {
            throw "Unable to create canvas!";
        }
        // let self=this;
        // document.addEventListener("", (ev) {
        //     self._visible=true;
        // });
        // this.canvasElement_.addEventListener("de")
        this.EnableExtensions([
            "OES_standard_derivatives",
            "WEBGL_depth_texture",
            "OES_texture_float",
            "OES_element_index_uint",
            "EXT_texture_filter_anisotropic",
            "OES_texture_float",
            "OES_texture_float_linear"
        ]);
    }
    get visible() {
        return this._visible;
    }
    get canvas() {
        if (!this.canvasElement_)
            return new HTMLCanvasElement();
        return this.canvasElement_;
    }
    // ...
    EnableExtensions(names) {
        let supportedExtensions = this.gl.getSupportedExtensions();
        if (!supportedExtensions)
            return false;
        let allFound = true;
        for (let name of names) {
            let found = false;
            for (let ext of supportedExtensions) {
                if (name == ext) {
                    this.enabledExtensions.set(name, this.gl.getExtension(name));
                    hflog.log("Extension " + name + " enabled");
                    found = true;
                    break;
                }
            }
            if (!found) {
                hflog.log("Extension " + name + " not enabled");
                allFound = false;
                break;
            }
        }
        return allFound;
    }
    GetExtension(name) {
        if (this.enabledExtensions.has(name)) {
            return this.enabledExtensions.get(name);
        }
        return null;
    }
}
class Hatchetfish {
    constructor(logElementId = "") {
        this._logElementId = "";
        this._logElement = null;
        this._numLines = 0;
        this.logElement = logElementId;
    }
    set logElement(id) {
        let el = document.getElementById(id);
        if (el instanceof HTMLDivElement) {
            this._logElement = el;
            this._logElementId = id;
        }
    }
    clear() {
        this._numLines = 0;
        if (this._logElement) {
            this._logElement.innerHTML = "";
        }
        let errorElement = document.getElementById("errors");
        if (errorElement) {
            errorElement.remove();
            //errorElement.innerHTML = "";
        }
    }
    writeToLog(prefix, message, ...optionalParams) {
        let text = prefix + ": " + message;
        for (let op of optionalParams) {
            if (op.toString) {
                text += " " + op.toString();
            }
            else {
                text += " <unknown>";
            }
        }
        if (this._logElement) {
            let newHTML = "<br/>" + text + this._logElement.innerHTML;
            this._logElement.innerHTML = newHTML;
            //this._logElement.appendChild(document.createElement("br"));
            //this._logElement.appendChild(document.createTextNode(text));
        }
    }
    log(message, ...optionalParams) {
        this.writeToLog("[LOG]", message, ...optionalParams);
        console.log(message, ...optionalParams);
    }
    info(message, ...optionalParams) {
        this.writeToLog("[INF]", message, ...optionalParams);
        console.info(message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.writeToLog("[ERR]", message, ...optionalParams);
        console.error(message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.writeToLog("[WRN]", message, ...optionalParams);
        console.warn(message, optionalParams);
    }
    debug(message, ...optionalParams) {
        console.log(message, ...optionalParams);
    }
}
var hflog = new Hatchetfish();
// Charles Emerson
// Started: Fall 2018
// Updated: 11 Nov 2018
// Basic Keyboard Input Listener
// Note abs(KEY_X) == abs(KEY_X_READ)
var KeyStatus;
(function (KeyStatus) {
    KeyStatus[KeyStatus["NONE"] = 0] = "NONE";
    KeyStatus[KeyStatus["KEY_DOWN_READ"] = -2] = "KEY_DOWN_READ";
    KeyStatus[KeyStatus["KEY_UP_READ"] = -1] = "KEY_UP_READ";
    KeyStatus[KeyStatus["KEY_UP"] = 1] = "KEY_UP";
    KeyStatus[KeyStatus["KEY_DOWN"] = 2] = "KEY_DOWN";
})(KeyStatus || (KeyStatus = {}));
class MyControls {
    constructor(keysToListenFor = []) {
        this.keysToListenFor = keysToListenFor;
        // Uses KeyboardEvent.code field to map a KeyStatus
        this.keysPressed = new Map();
        // Prevent default action of ctrl and/or alt modifiers
        this.prevent_ctrl = false;
        this.prevent_alt = false;
        let self = this;
        document.onkeydown = (e) => {
            // Only prevent default action of those we are listening for
            keysToListenFor.forEach((key) => {
                // Usually don't want to prevent ctrl and alt modified key events
                if (key == e.code && (!e.ctrlKey || this.prevent_ctrl) && (!e.altKey || this.prevent_alt)) {
                    e.preventDefault();
                }
            });
            if (!e.repeat) {
                self.keysPressed.set(e.code, KeyStatus.KEY_DOWN);
            }
        };
        document.onkeyup = (e) => {
            // Only prevent default action of those we are listening for
            keysToListenFor.forEach((key) => {
                if (key == e.code) {
                    e.preventDefault();
                }
            });
            let status = self.keysPressed.get(e.code);
            if (status != KeyStatus.KEY_UP_READ) {
                self.keysPressed.set(e.code, KeyStatus.KEY_UP);
            }
        };
    }
    checkAndUpdateListeners(names) {
        names.forEach((e) => {
            let doesntHaveName = true;
            for (let j = 0; j < this.keysToListenFor.length; ++j) {
                if (e == this.keysToListenFor[j]) {
                    doesntHaveName = false;
                    break;
                }
            }
            if (doesntHaveName) {
                this.keysToListenFor.push(e);
            }
        });
    }
    /** Couldn't come up with a good reason to use KeyStatus directly */
    // get(name: string): KeyStatus {
    //     this.checkAndUpdateListeners([name]);
    //     let temp = this.keysPressed.get(name);
    //     if (!temp) {
    //         return KeyStatus.NONE;
    //     }
    //     this.keysPressed.set(name, -Math.abs(temp));
    //     return temp;
    // }
    // getFrom(names: string[]): KeyStatus {
    //     this.checkAndUpdateListeners(names);
    //     let value: KeyStatus = KeyStatus.NONE;
    //     for(let i = 0; i < names.length; ++i) {
    //         let temp = this.keysPressed.get(names[i]);
    //         if (temp != undefined && temp != KeyStatus.NONE) {
    //             value = temp;
    //             this.keysPressed.set(names[i], -Math.abs(value));
    //         }
    //     }
    //     return value;
    // }
    isKeyClick(names) {
        let keyclick = false;
        names.forEach((e) => {
            let temp = this.keysPressed.get(e);
            if (temp && temp == KeyStatus.KEY_DOWN) {
                this.keysPressed.set(e, KeyStatus.KEY_DOWN_READ);
                keyclick = true;
            }
        });
        // You never start a program with a key down
        if (!keyclick)
            this.checkAndUpdateListeners(names);
        return keyclick;
    }
    isKeyDown(keys) {
        let keydown = false;
        keys.forEach((e) => {
            let temp = this.keysPressed.get(e);
            // For any of the that keys have KEY_DOWN set to KEY_DOWN_READ
            if (temp && Math.abs(temp) == KeyStatus.KEY_DOWN) {
                this.keysPressed.set(e, KeyStatus.KEY_DOWN_READ);
                keydown = true;
            }
        });
        // You never start a program with a key down
        if (!keydown)
            this.checkAndUpdateListeners(keys);
        return keydown;
    }
    isKeyUp(keys) {
        let keyup = false;
        keys.forEach((e) => {
            let temp = this.keysPressed.get(e);
            // For any of the that keys have KEY_UP set to KEY_UP_READ
            if (temp && Math.abs(temp) == KeyStatus.KEY_UP) {
                this.keysPressed.set(e, KeyStatus.KEY_UP_READ);
                keyup = true;
            }
        });
        // You never start a program with a key down
        if (!keyup)
            this.checkAndUpdateListeners(keys);
        return keyup;
    }
}
// J. B. Metzgar
// Started: Fall 2018
// For CS480 Computer Graphics Fundamentals
/// <reference path="MyColor.ts" />
class MyShapeOutline {
    constructor(type = 0, first = 0, count = 0) {
        this.type = type;
        this.first = first;
        this.count = count;
    }
}
class MyShape {
    constructor() {
        this.currentVertex = Vector3.make(0, 0, 0);
        this.currentColor = Vector3.make(1, 1, 1);
        this.currentTexCoord = Vector2.make(0, 0);
        this.currentNormal = Vector3.make(0, 0, 1);
        this.count = 0;
        this.vertices = [];
        this.surfaces = [];
        this.dirty = true;
        this.buffer = null;
        this.vOffset = 0;
        this.cOffset = 4 * 3;
        this.tOffset = 4 * 6;
        this.nOffset = 4 * 8;
        this.stride = 4 * 11;
    }
    vertex(x, y, z) {
        this.currentVertex.x = x;
        this.currentVertex.y = y;
        this.currentVertex.z = z;
        this.emitVertex();
    }
    vertex3(xyz) {
        this.currentVertex.x = xyz.x;
        this.currentVertex.y = xyz.y;
        this.currentVertex.z = xyz.z;
        this.emitVertex();
    }
    color(r, g, b) {
        this.currentColor.x = r;
        this.currentColor.y = g;
        this.currentColor.z = b;
    }
    color3(rgb) {
        this.currentColor.copy(rgb);
    }
    texCoord(s, t) {
        this.currentTexCoord.x = s;
        this.currentTexCoord.y = t;
    }
    texCoord2(st) {
        this.currentTexCoord.x = st.x;
        this.currentTexCoord.y = st.y;
    }
    normal(x, y, z) {
        this.currentNormal.reset(x, y, z);
    }
    normal3(xyz) {
        this.currentNormal.reset(xyz.x, xyz.y, xyz.z);
    }
    // add a new index to the surface
    // negative numbers backward index into the shape vertices
    addIndex(which) {
    }
    clear() {
        this.vertices = [];
        this.surfaces = [];
        this.dirty = true;
    }
    newSurface(type) {
        let surface = new MyShapeOutline(type, this.count, 0);
        this.surfaces.push(surface);
    }
    emitVertex() {
        if (this.surfaces.length == 0) {
            return;
        }
        let last = this.surfaces.length - 1;
        let v = [
            this.currentVertex.x,
            this.currentVertex.y,
            this.currentVertex.z,
            this.currentColor.x,
            this.currentColor.y,
            this.currentColor.z,
            this.currentTexCoord.x,
            this.currentTexCoord.y,
            this.currentNormal.x,
            this.currentNormal.y,
            this.currentNormal.z
        ];
        this.vertices.push(...v);
        this.count++;
        this.surfaces[last].count++;
        this.dirty = true;
    }
    buildBuffers(gl) {
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
        this.dirty = false;
    }
    draw(gl, vertexIndex = -1, colorIndex = -1, texCoordIndex = -1, normalIndex = -1) {
        if (this.dirty)
            this.buildBuffers(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        if (vertexIndex >= 0) {
            gl.enableVertexAttribArray(vertexIndex);
            gl.vertexAttribPointer(vertexIndex, 3, gl.FLOAT, false, this.stride, this.vOffset);
        }
        if (colorIndex >= 0) {
            gl.enableVertexAttribArray(colorIndex);
            gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, this.stride, this.cOffset);
        }
        if (texCoordIndex >= 0) {
            gl.enableVertexAttribArray(texCoordIndex);
            gl.vertexAttribPointer(texCoordIndex, 2, gl.FLOAT, false, this.stride, this.tOffset);
        }
        if (normalIndex >= 0) {
            gl.enableVertexAttribArray(normalIndex);
            gl.vertexAttribPointer(colorIndex, 3, gl.FLOAT, false, this.stride, this.nOffset);
        }
        for (let surface of this.surfaces) {
            gl.drawArrays(surface.type, surface.first, surface.count);
        }
    }
}
// Charles Emerson
// Started: 14 Nov 2018
// Updated: 14 Nov 2018
// 
// For CS480 Research Project
function multMatrixAndVector(A, v) {
    return new Vector4(A.m11 * v.x + A.m21 * v.y + A.m31 * v.z + A.m41 * v.w, A.m12 * v.x + A.m22 * v.y + A.m32 * v.z + A.m42 * v.w, A.m13 * v.x + A.m23 * v.y + A.m33 * v.z + A.m43 * v.w, A.m14 * v.x + A.m24 * v.y + A.m34 * v.z + A.m44 * v.w);
}
function get3dPoint(point2D, width, height, viewMatrix, projectionMatrix) {
    let x = 2.0 * point2D.x / width - 1;
    let y = -2.0 * point2D.y / height + 1;
    let viewProjectionInverse = (Matrix4.multiply(projectionMatrix, viewMatrix)).asInverse();
    let point3D = new Vector4(-x * viewMatrix.m34, -y * viewMatrix.m34, 0, 0);
    return multMatrixAndVector(viewProjectionInverse, point3D);
}
class Particle {
    constructor() {
        this.size = 0;
        this.color = new Vector3();
        this.origin = new Vector3();
        this.position = new Vector3();
        this.velocity = new Vector3();
        this.life = 0;
    }
}
;
class ParticleExplosionApp {
    constructor(width = 512, height = 384) {
        this.width = width;
        this.height = height;
        this.t0 = 0;
        this.t1 = 0;
        this.dt = 0;
        this.uiUpdateTime = 0;
        this.particles = new Array(0);
        this.particleColor = new Vector3(0, 1, 0);
        this.surfaces = new MyShape();
        this.orderOfMag = 3;
        this.uiText = document.getElementById("uiText");
        this.frameCount = 0;
        this.lastFrameCountTime = 0;
        this.mouseClickPosition = new Vector2(-100, -100);
        this.slowMethod = 0;
        this.illustrationMethod = 2;
        this.uPointSize = null;
        this.debug = false;
        this.pause = false;
        this.maxLife = 0;
        this.shaderProgram = null;
        this.aVertexLocation = 0;
        this.aColorLocation = 0;
        this.uModelViewMatrixLocation = null;
        this.uProjectionMatrixLocation = null;
        this.uColor = null;
        this.uWorldMatrixLocation = null;
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
    run() {
        this.init();
        this.mainloop(0);
    }
    init() {
        this.loadInput();
        this.loadShaders();
    }
    loadInput() {
        this.renderingContext.canvas.onclick = (e) => {
            // Global offset
            // hflog.log("Global: (" + (e.x) + ", " + e.y + ")");
            // // Canvas offset
            // hflog.log("Canvas: (" + (e.offsetX) + ", " + e.offsetY + ")");
            this.mouseClickPosition.x = e.offsetX;
            this.mouseClickPosition.y = e.offsetY;
            // let x = e.offsetX / this.renderingContext.canvas.width  *  2 - 1;
            // let y = e.offsetY / this.renderingContext.canvas.height * -2 + 1;
            // hflog.log("webgl: (" + x + ", " + y + ")");
        };
    }
    loadShaders() {
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
    loadShader(type, source) {
        let gl = this.renderingContext.gl;
        const shader = gl.createShader(type);
        if (!shader)
            return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            hflog.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    mainloop(timestamp) {
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
        window.requestAnimationFrame((t) => {
            self.update();
            self.display();
            self.mainloop(t);
        });
    }
    updateUI() {
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
            desc += "<br/>Representation: ";
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
            let str = desc + "<br/>FPS: " + fps.toPrecision(3) + "<br/># Particles: " + this.particles.length + "<br/>Max Life of Particles: " + this.maxLife.toPrecision(3) + " seconds";
            if (this.uiText.innerHTML != str && (!this.debug || !this.pause)) {
                this.uiText.innerHTML = str;
            }
        }
    }
    increaseParticles(x = 0, y = 0, z = 0) {
        if (this.particles) {
            let numSpawned = Math.pow(10, this.orderOfMag);
            for (let i = 0; i < numSpawned; ++i) {
                let particle = new Particle();
                particle.color = this.particleColor;
                particle.position = new Vector3(x, y, z);
                particle.origin = particle.position;
                particle.size = 0.05;
                let speed = (this.slowMethod >= 2 && this.slowMethod != 4) ? 0.1 : 20.0;
                particle.velocity = Vector3.makeFromSpherical(2 * Math.PI * Math.random(), Math.PI * (Math.random() - 0.5)).mul(speed);
                this.particles.push(particle);
            }
        }
    }
    update() {
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
            let accelSlower = -ACCELERATION * this.dt;
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
                    }
                    else {
                        this.particles[i].velocity = this.particles[i].velocity.mul(slowFactor);
                    }
                }
                else {
                    if (this.slowMethod == 2) {
                        this.particles[i].velocity = this.particles[i].velocity.mul(speedFactor);
                    }
                    else if (this.slowMethod == 3) {
                        // Apply acceleration
                        let deltaV = this.particles[i].velocity.norm().mul(accelFaster);
                        this.particles[i].velocity = this.particles[i].velocity.add(deltaV);
                    }
                    else { // this.slowMethod == 4
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
            this.slowMethod = (this.slowMethod != 0) ? 0 : 1;
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
        if (keys.isKeyDown(["Space"]) || keys.isKeyClick(["KeyA"])) {
            this.increaseParticles();
        }
        ++this.frameCount;
    }
    display() {
        let gl = this.renderingContext.gl;
        let sine = Math.abs(Math.sin(this.t1));
        if (this.debug) {
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
        else {
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
                    let speed = (this.slowMethod >= 2 && this.slowMethod != 4) ? 0.1 : 20.0;
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
                    let color = (this.debug) ? black : e.color;
                    surface.newSurface(gl.TRIANGLE_FAN);
                    surface.color3(color);
                    surface.vertex(-0.5 * scale + pos.x, -0.5 * scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(0.5 * scale + pos.x, -0.5 * scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(0.5 * scale + pos.x, 0.5 * scale + pos.y, pos.z);
                    surface.color3(color);
                    surface.vertex(-0.5 * scale + pos.x, 0.5 * scale + pos.y, pos.z);
                });
            }
            else if (this.illustrationMethod == 1) {
                this.particles.forEach((e) => {
                    let origin = e.origin;
                    let pos = e.position;
                    let color = (this.debug) ? black : e.color;
                    surface.newSurface(gl.LINES);
                    surface.color(color.r, color.g, color.b);
                    surface.vertex3(origin);
                    surface.color(color.r, color.g, color.b);
                    surface.vertex3(pos);
                });
            }
            else if (this.illustrationMethod == 2) {
                this.particles.forEach((e) => {
                    let pos = e.position;
                    let color = (this.debug) ? black : e.color;
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
// Charles Emerson
// Started: 16 Nov 2018
// Updated: 16 Nov 2018
///<reference path="../library/gte/Vector3.ts"/>
function getRandomBrightColor() {
    let r = Math.random() * 0.25 + 0.25;
    let g = Math.random() * 0.25 + 0.25;
    let b = Math.random() * 0.25 + 0.25;
    let x = Math.random();
    if (Math.random() < 0.5) {
        if (x < 1 / 3) {
            r = 0.2 * Math.random() + 0.8;
        }
        else if (x < 2 / 3) {
            g = 0.2 * Math.random() + 0.8;
        }
        else {
            b = 0.2 * Math.random() + 0.8;
        }
    }
    else {
        if (x < 1 / 3) {
            r = 0.2 * Math.random() + 0.8;
            g = 0.2 * Math.random() + 0.8;
        }
        else if (x < 2 / 3) {
            r = 0.2 * Math.random() + 0.8;
            b = 0.2 * Math.random() + 0.8;
        }
        else {
            g = 0.2 * Math.random() + 0.8;
            b = 0.2 * Math.random() + 0.8;
        }
    }
    return new Vector3(r, g, b);
}
function getRandomMutedColor() {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();
    if (r < 0.3) {
        g = Math.random();
        if (g < 0.5) {
            b = Math.random() * 0.3 + 0.4;
        }
        else {
            b = Math.random() * 0.5;
        }
    }
    else if (r < 0.6) {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        }
        else {
            g = Math.random() * 0.5;
        }
    }
    else {
        if (b < 0.5) {
            g = Math.random() * 0.3 + 0.4;
        }
        else {
            g = Math.random() * 0.5;
        }
    }
    return new Vector3(r, g, b);
}
function getRandomColor() {
    return new Vector3(Math.random(), Math.random(), Math.random());
}
//# sourceMappingURL=library.js.map