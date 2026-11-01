/**
 * One checkpoint in the wedding quest log. The node owns its own DOM so the
 * timeline controller can focus on stage state and scroll behaviour.
 */
export class WeddingTimelineNode {
  constructor({ stage, index }) {
    this.stage = stage;
    this.index = index;
    this.element = this.createElement();
  }

  createElement() {
    const listItem = document.createElement('li');
    listItem.className = `wedding-timeline-node wedding-timeline-node--${this.stage.accent}`;
    listItem.id = `timeline-stage-${this.stage.id}`;
    listItem.dataset.stageIndex = String(this.index);
    listItem.style.setProperty('--stage-order', String(this.index));

    listItem.innerHTML = `
      <div class="wedding-timeline-node__rail" aria-hidden="true">
        <span class="wedding-timeline-node__marker">
          <span class="wedding-timeline-node__marker-index">${this.stage.stageNumber}</span>
          <span class="wedding-timeline-node__marker-dot"></span>
        </span>
      </div>

      <article class="wedding-timeline-node__card pixel-frame">
        <span class="wedding-timeline-node__current-badge">CURRENT STAGE</span>

        <header class="wedding-timeline-node__header">
          <p class="wedding-timeline-node__meta">
            <span class="wedding-timeline-node__time">${this.stage.time}</span>
            <span class="wedding-timeline-node__location">${this.stage.location}</span>
          </p>
          <p class="wedding-timeline-node__tagline">${this.stage.tagline}</p>
          <h3 class="wedding-timeline-node__title">${this.stage.title}</h3>
        </header>

        <p class="wedding-timeline-node__description">${this.stage.description}</p>

        <div class="wedding-timeline-node__objectives-block">
          <p class="wedding-timeline-node__objectives-label">QUEST OBJECTIVES</p>
          <ul class="wedding-timeline-node__objectives">
            ${this.stage.objectives.map((objective) => `<li>${objective}</li>`).join('')}
          </ul>
        </div>

        <p class="wedding-timeline-node__note">${this.stage.note}</p>
        <span class="wedding-timeline-node__stamp" aria-hidden="true">CHECKPOINT ${this.stage.stageNumber}</span>
      </article>
    `;

    return listItem;
  }

  setActive(isActive) {
    this.element.classList.toggle('is-active', isActive);

    if (isActive) {
      this.element.setAttribute('aria-current', 'step');
    } else {
      this.element.removeAttribute('aria-current');
    }
  }
}
