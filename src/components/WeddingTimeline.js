import { WeddingTimelineNode } from './WeddingTimelineNode.js';

/**
 * Coordinates the quest-log timeline: builds each node, mirrors the active
 * checkpoint into the HUD, and keeps scroll position and stage state in sync.
 */
export class WeddingTimeline {
  constructor({
    root,
    stages,
    progressBar,
    progressFill,
    stageLabel,
    previousButton,
    nextButton,
    onStageChange = () => {},
  }) {
    this.root = root;
    this.stages = stages;
    this.progressBar = progressBar;
    this.progressFill = progressFill;
    this.stageLabel = stageLabel;
    this.previousButton = previousButton;
    this.nextButton = nextButton;
    this.onStageChange = onStageChange;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.nodes = [];
    this.activeIndex = 0;
    this.scrollFrame = null;
    this.isDisposed = false;
    this.keyboardRoot = this.root?.parentElement ?? this.root;

    if (!this.root || this.stages.length === 0) return;

    this.render();
    this.bindEvents();
    this.setActiveStage(0);
  }

  render() {
    const track = document.createElement('ol');
    track.className = 'wedding-timeline__track';
    track.setAttribute('aria-label', 'Wedding celebration stages');

    const fragment = document.createDocumentFragment();

    this.stages.forEach((stage, index) => {
      const node = new WeddingTimelineNode({ stage, index });
      this.nodes.push(node);
      fragment.append(node.element);
    });

    track.append(fragment);
    this.root.replaceChildren(track);
  }

  bindEvents() {
    this.handlePrevious = () => this.goToStage(this.activeIndex - 1);
    this.handleNext = () => this.goToStage(this.activeIndex + 1);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.previousButton?.addEventListener('click', this.handlePrevious);
    this.nextButton?.addEventListener('click', this.handleNext);
    this.keyboardRoot?.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll, { passive: true });
  }

  handleScroll() {
    if (this.scrollFrame !== null || this.isDisposed) return;

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = null;
      this.syncActiveStageToScroll();
    });
  }

  syncActiveStageToScroll() {
    const timelineBounds = this.root.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (timelineBounds.bottom < 80 || timelineBounds.top > viewportHeight - 80) {
      return;
    }

    const readingAnchor = viewportHeight * 0.35;
    let nearestIndex = this.activeIndex;
    let nearestDistance = Number.POSITIVE_INFINITY;

    this.nodes.forEach((node, index) => {
      const nodeBounds = node.element.getBoundingClientRect();
      const nodeCenter = nodeBounds.top + nodeBounds.height / 2;
      const distance = Math.abs(nodeCenter - readingAnchor);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== this.activeIndex) {
      this.setActiveStage(nearestIndex);
    }
  }

  goToStage(index, { emitSound = true } = {}) {
    const boundedIndex = Math.max(0, Math.min(this.stages.length - 1, index));

    if (boundedIndex === this.activeIndex) {
      this.nodes[boundedIndex]?.element.scrollIntoView({
        behavior: this.reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
      return;
    }

    this.setActiveStage(boundedIndex, { scrollIntoView: true, emitSound });
  }

  setActiveStage(index, { scrollIntoView = false, emitSound = false } = {}) {
    const stage = this.stages[index];
    if (!stage) return;

    const stageChanged = index !== this.activeIndex;
    this.activeIndex = index;

    this.nodes.forEach((node, nodeIndex) => {
      node.setActive(nodeIndex === index);
    });

    if (this.stageLabel) {
      this.stageLabel.textContent = `${stage.stageNumber} / ${String(this.stages.length).padStart(2, '0')}`;
    }

    if (this.progressFill) {
      this.progressFill.style.width = `${((index + 1) / this.stages.length) * 100}%`;
    }

    if (this.progressBar) {
      this.progressBar.setAttribute('aria-valuenow', String(index + 1));
      this.progressBar.setAttribute(
        'aria-valuetext',
        `Stage ${index + 1} of ${this.stages.length}: ${stage.title}`,
      );
    }

    if (this.previousButton) {
      this.previousButton.disabled = index === 0;
    }

    if (this.nextButton) {
      this.nextButton.disabled = index === this.stages.length - 1;
    }

    this.root.dataset.activeStage = stage.id;

    if (scrollIntoView) {
      this.nodes[index].element.scrollIntoView({
        behavior: this.reducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }

    if (stageChanged && emitSound) {
      this.onStageChange(index, stage);
    }
  }

  handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.goToStage(this.activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.goToStage(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.goToStage(this.stages.length - 1);
    }
  }

  dispose() {
    this.isDisposed = true;

    if (this.scrollFrame !== null) {
      window.cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = null;
    }

    this.previousButton?.removeEventListener('click', this.handlePrevious);
    this.nextButton?.removeEventListener('click', this.handleNext);
    this.keyboardRoot?.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }
}
