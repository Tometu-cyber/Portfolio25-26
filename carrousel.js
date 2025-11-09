import { LitElement, html, css } from "https://esm.sh/lit";

class ActivitiesWidget extends LitElement {
    static properties = {
        count: { type: Number },
        activeActivity: { type: Number }
    };

    constructor() {
        super();
        this.activeActivity = 1;
    }

    connectedCallback() {
        super.connectedCallback();
        this.allActivities = this.querySelectorAll(".activity");
        this.allActivities[0].classList.add("active");
        this.count = this.allActivities.length;
    }

    _makeActive(index) {
        this.allActivities.forEach((activity) => {
            activity.classList.remove("active");
        });
        this.allActivities[index].classList.add("active");
        this.classList.add("children-animating");
        this.allActivities[index].addEventListener(
            "animationend",
            () => {
                this.classList.remove("children-animating");
            },
            { once: true }
        );
    }

    _movePrevious() {
        this.activeActivity--;
        if (this.activeActivity < 1) {
            this.activeActivity = this.count;
            this._makeActive(this.count - 1);
        } else {
            this._makeActive(this.activeActivity - 1);
        }
    }

    _moveNext() {
        this.activeActivity++;
        if (this.activeActivity > this.count) {
            this.activeActivity = 1;
            this._makeActive(0);
        } else {
            this._makeActive(this.activeActivity - 1);
        }
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <div class="activities-count">${this.activeActivity}/${this.count}</div>
            <nav class="activities-navigation">
                <button aria-label="previous" @click="${this._movePrevious}">⭠</button>
                <button aria-label="next" @click="${this._moveNext}">⭢</button>
            </nav>
        `;
    }
}

customElements.define("activities-widget", ActivitiesWidget);