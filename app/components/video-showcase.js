import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { next, later } from '@ember/runloop';

export default class VideoStudioComponent extends Component {
  @service currentStore;
  @tracked selectedVideo = null;
  @tracked isVisible = false;

  constructor() {
    super(...arguments);
    next(this, this.autoOpenFirst);
  }

  autoOpenFirst() {
    const videos = this.currentStore.youtubeVideos;
    if (videos && videos.length > 0) {
      this.selectedVideo = videos[0];
      later(this, this.triggerEntrance, 100);
    }
  }

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
  }
}
