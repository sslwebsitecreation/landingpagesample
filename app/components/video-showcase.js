import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { next, later } from '@ember/runloop';

export default class VideoStudioComponent extends Component {
  @service currentStore;
  @tracked selectedVideo = null;
  @tracked isVisible = false;

  @action
  selectVideo(video) {
    if (this.selectedVideo?.id === video.id) return;

    if (this.selectedVideo) {
      this.isVisible = false;
      later(
        this,
        () => {
          this.selectedVideo = video;
          this.triggerEntrance();
        },
        400
      );
    } else {
      this.selectedVideo = video;
      this.triggerEntrance();
    }
  }

  triggerEntrance() {
    next(() => {
      this.isVisible = true;
    });
  }

  @action
  closeStudio() {
    this.isVisible = false;
    later(
      this,
      () => {
        this.selectedVideo = null;
      },
      800
    );
  }
}
