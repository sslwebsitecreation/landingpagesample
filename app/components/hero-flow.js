import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import * as THREE from 'three';
import gsap from 'gsap';

export default class HeroFlowComponent extends Component {
  renderer = null;
  scene = null;
  camera = null;
  mesh = null;
  clock = new THREE.Clock();
  @tracked scrollProgress = 0;
  element = null;

  @action
  setupScene(element) {
    this.element = element;
    const width = element.clientWidth;
    const height = element.clientHeight;
    const isMobile = width < 768;

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      isMobile ? 85 : 75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = isMobile ? 6 : 5;

    // 2. Renderer with Alpha for Background Blending
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    element.appendChild(this.renderer.domElement);

    // 3. Generative Silk Geometry
    const geometry = new THREE.PlaneGeometry(
      16,
      10,
      isMobile ? 64 : 128,
      isMobile ? 64 : 128
    );
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.5,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -0.5;
    this.scene.add(this.mesh);

    // 4. Vibrant Lighting (Saffron & Magenta)
    const light1 = new THREE.PointLight(0xff9933, 25); // Saffron
    light1.position.set(5, 5, 5);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xc2185b, 25); // Magenta
    light2.position.set(-5, -5, 5);
    this.scene.add(light2);

    const light3 = new THREE.PointLight(0xffd700, 15); // Gold Shimmer
    light3.position.set(0, 3, 2);
    this.scene.add(light3);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // 5. Interaction Tracking
    this.handleInput = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = (clientX / window.innerWidth) * 2 - 1;
      gsap.to(this.mesh.rotation, {
        y: x * 0.2,
        duration: 1.2,
        ease: 'power2.out',
      });
    };

    window.addEventListener(
      isMobile ? 'touchmove' : 'mousemove',
      this.handleInput
    );

    // 6. Scroll tracking for parallax
    this.handleScroll = () => {
      if (!this.element) return;
      const rect = this.element.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / window.innerHeight, 0), 1);
      this.scrollProgress = progress;

      // Parallax: move canvas slower than scroll
      const canvas = this.renderer?.domElement;
      if (canvas) {
        canvas.style.transform = `translateY(${progress * 60}px)`;
      }

      // Fade and move content on scroll
      const content = element.querySelector('.hero-content');
      if (content) {
        content.style.opacity = 1 - progress * 1.5;
        content.style.transform = `translateY(${progress * -80}px)`;
      }

      // Depth overlay parallax
      const overlay = element.querySelector('.hero-depth-overlay');
      if (overlay) {
        overlay.style.transform = `translateY(${progress * 30}px)`;
      }
    };

    window.addEventListener('scroll', this.handleScroll, { passive: true });

    // 7. Resize Handler
    this.onResize = () => {
      if (!this.renderer || !element) return;

      const newWidth = element.clientWidth;
      const newHeight = element.clientHeight;

      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', this.onResize);

    // Initial scroll position
    this.handleScroll();

    this.animate();
  }

  animate = () => {
    if (!this.renderer) return;
    this.animationId = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();
    const pos = this.mesh.geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave =
        Math.sin(x * 0.4 + time) * 0.3 + Math.cos(y * 0.3 + time * 0.8) * 0.2;
      pos.setZ(i, wave);
    }

    pos.needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  };

  willDestroy() {
    super.willDestroy(...arguments);
    window.removeEventListener('mousemove', this.handleInput);
    window.removeEventListener('touchmove', this.handleInput);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.handleScroll);
    cancelAnimationFrame(this.animationId);
    if (this.renderer) this.renderer.dispose();
  }
}
