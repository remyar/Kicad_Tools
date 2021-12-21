class ArcSegmenter {
    constructor(x0, y0, x1, y1, a, b, alfa, sweep, larc) {
        this.PI2 = Math.PI * 2;
        this.ACC_ZERO_ANG = 0.001 * Math.PI / 180.0;
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.a = a;
        this.b = b;
        this.alpha = alfa;
        this.sweep = sweep;
        this.larc = larc;
        this.sx = 0;
        this.sy = 0;
        this.a0 = 0;
        this.a1 = 0;
        this.da = 0;
        this.ang = 0;
        this.compute();
    }

    compute() {
        let ax;
        let ay;
        let bx;
        let by;
        let vx;
        let vy;
        let l;
        let db;
        let _sweep;
        let c;
        let s;
        let e;

        this.ang = Math.PI - this.alpha;
        _sweep = this.sweep;

        e = (this.a / this.b);
        c = Math.cos(this.ang);
        s = Math.sin(this.ang);
        ax = (this.x0 * c) - (this.y0 * s);
        ay = (this.x0 * s) + (this.y0 * c);
        bx = (this.x1 * c) - (this.y1 * s);
        by = (this.x1 * s) + (this.y1 * c);

        ay *= e;                  // transform to circle
        by *= e;

        this.sx = 0.5 * (ax + bx);     // mid point between A,B
        this.sy = 0.5 * (ay + by);
        vx = (ay - by);
        vy = (bx - ax);
        l = ((this.a * this.a) / ((vx * vx) + (vy * vy))) - 0.25;
        if (l < 0) {
            l = 0;
        }
        l = Math.sqrt(l);

        vx *= l;
        vy *= l;

        if (_sweep || this.larc) {
            this.sx += vx;
            this.sy += vy;
        }
        else {
            this.sx -= vx;
            this.sy -= vy;
        }

        this.a0 = Math.atan2(ay - this.sy, ax - this.sx);
        this.a1 = Math.atan2(by - this.sy, bx - this.sx);
        this.sy = this.sy / e;

        this.da = this.a1 - this.a0;

        if (Math.abs(Math.abs(this.da) - Math.PI) <= this.ACC_ZERO_ANG) {     // half arc is without larc and sweep is not working instead change a0,a1
            db = (0.5 * (this.a0 + this.a1)) - Math.atan2(by - ay, bx - ax);
            while (db < -Math.PI) {
                db += this.PI2;     // db<0 CCW ... sweep=1
            }
            while (db > Math.PI) {
                db -= this.PI2;     // db>0  CW ... sweep=0
            }
            _sweep = false;

            if ((db < 0.0) && (!this.sweep)) {
                _sweep = true;
            }
            if ((db > 0.0) && (this.sweep)) {
                _sweep = true;
            }
            if (_sweep) {
                if (this.da >= 0.0) {
                    this.a1 -= this.PI2;
                }
                if (this.da < 0.0) {
                    this.a0 -= this.PI2;
                }
            }
        }
        else
            if (this.larc) {            // big arc
                if ((this.da < Math.PI) && (this.da >= 0.0)) {
                    this.a1 -= this.PI2;
                }
                else if ((this.da > -Math.PI) && (this.da < 0.0)) {
                    this.a0 -= this.PI2;
                }
            }
            else {                      // small arc
                if (this.da > Math.PI) {
                    this.a1 -= this.PI2;
                } else if (this.da < -Math.PI) {
                    this.a0 -= this.PI2;
                }
            }

        this.da = this.a1 - this.a0;
    }

    getpnt(t) {
        let result = {
            x: NaN,
            y: NaN
        };
        let c;
        let s;
        let x;
        let y;

        t = this.a0 + (this.da * t);
        x = this.sx + (this.a * Math.cos(t));
        y = this.sy + (this.b * Math.sin(t));
        c = Math.cos(-this.ang);
        s = Math.sin(-this.ang);
        result.x = (x * c) - (y * s);
        result.y = (x * s) + (y * c);

        return result;
    }
}


module.exports = ArcSegmenter;