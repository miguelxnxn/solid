import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { clickOnElement } from '../../internal/test.js';
import SdCarousel from './carousel';
import sinon from 'sinon';

describe('<sd-carousel>', () => {
  it('should render a carousel with default configuration', async () => {
    // Arrange
    const el = await fixture<SdCarousel>(html`
      <sd-carousel>
        <sd-carousel-item>Node 1</sd-carousel-item>
        <sd-carousel-item>Node 2</sd-carousel-item>
        <sd-carousel-item>Node 3</sd-carousel-item>
      </sd-carousel>
    `);

    // Assert
    expect(el).to.exist;
    expect(el).to.have.attribute('role', 'region');
    expect(el).to.have.attribute('aria-label', 'Carousel');
    expect(el.shadowRoot!.querySelector('.carousel__navigation')).to.exist;
    expect(el.shadowRoot!.querySelector('.carousel__pagination')).to.exist;
    expect(el.shadowRoot!.querySelector('.number')).to.exist;
  });

  it('should render a carousel with dot variation', async () => {
    // Arrange
    const el = await fixture<SdCarousel>(html`
      <sd-carousel variant="dot">
        <sd-carousel-item>Node 1</sd-carousel-item>
        <sd-carousel-item>Node 2</sd-carousel-item>
        <sd-carousel-item>Node 3</sd-carousel-item>
      </sd-carousel>
    `);

    // Assert
    expect(el).to.exist;
    expect(el).to.have.attribute('role', 'region');
    expect(el).to.have.attribute('aria-label', 'Carousel');
    expect(el.shadowRoot!.querySelector('.carousel__navigation')).to.exist;
    expect(el.shadowRoot!.querySelector('.carousel__pagination')).to.exist;
    expect(el.shadowRoot!.querySelector('.dot')).to.exist;
  });

  it('should be scrollable along the x-axis', async () => {
    // Arrange
    const el = await fixture<SdCarousel>(html`
      <sd-carousel style="height: 100px">
        <sd-carousel-item>Node 1</sd-carousel-item>
        <sd-carousel-item>Node 2</sd-carousel-item>
      </sd-carousel>
    `);

    // Act
    await el.updateComplete;

    // Assert
    expect(el.scrollContainer.scrollWidth).to.be.greaterThan(el.scrollContainer.clientWidth);
    expect(el.scrollContainer.scrollHeight).to.be.equal(el.scrollContainer.clientHeight);
  });

  describe('when `autoplay` attribute is provided', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers({
        now: new Date()
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it('should pause the autoplay while the user is interacting', async () => {
      // Arrange
      const el = await fixture<SdCarousel>(html`
        <sd-carousel autoplay>
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);
      sinon.stub(el, 'next');

      await el.updateComplete;

      // Act
      el.dispatchEvent(new Event('mouseenter'));
      await el.updateComplete;
      clock.next();
      clock.next();

      // Assert
      expect(el.next).not.to.have.been.called;
    });

    it('should not resume if the user is still interacting', async () => {
      // Arrange
      const el = await fixture<SdCarousel>(html`
        <sd-carousel autoplay>
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);
      sinon.stub(el, 'next');

      await el.updateComplete;

      // Act
      el.dispatchEvent(new Event('mouseenter'));
      el.dispatchEvent(new Event('focusin'));
      await el.updateComplete;

      el.dispatchEvent(new Event('mouseleave'));
      await el.updateComplete;

      clock.next();
      clock.next();

      // Assert
      expect(el.next).not.to.have.been.called;
    });
  });

  describe('when `loop` attribute is provided', () => {
    it('should create clones of the first and last slides', async () => {
      // Arrange
      const el = await fixture<SdCarousel>(html`
        <sd-carousel loop>
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);

      // Act
      await el.updateComplete;

      // Assert
      expect(el.firstElementChild).to.have.attribute('data-clone', '2');
      expect(el.lastElementChild).to.have.attribute('data-clone', '0');
    });

    describe('`slides-per-page` is provided', () => {
      it('should create multiple clones', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel loop slides-per-page="2">
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);

        // Act
        await el.updateComplete;
        const clones = [...el.children].filter(child => child.hasAttribute('data-clone'));

        // Assert
        expect(clones).to.have.lengthOf(4);
      });
    });
  });

  describe('when `variant` attribute is used', () => {
    it('should render page numbers when variant is number', async () => {
      // Arrange
      const el = await fixture(html`
        <sd-carousel variant="number">
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);
      // Assert
      expect(el).to.exist;
      expect(el.shadowRoot!.querySelector('.dot')).not.to.exist;
      expect(el.shadowRoot!.querySelector('.number')).to.exist;
    });

    it('should render dot pagination when variant is dot', async () => {
      // Arrange
      const el = await fixture(html`
        <sd-carousel variant="dot">
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);
      // Assert
      expect(el).to.exist;
      expect(el.shadowRoot!.querySelector('.number')).not.to.exist;
      expect(el.shadowRoot!.querySelector('.dot')).to.exist;
    });
    describe('and user clicks on a pagination button', () => {
      it('should scroll the carousel to the nth slide', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel variant="dot">
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        sinon.stub(el, 'goToSlide');
        await el.updateComplete;
        // Act
        const paginationItem = el.shadowRoot!.querySelectorAll('.carousel__pagination-item')[2] as HTMLElement;
        await clickOnElement(paginationItem);
        expect(el.goToSlide).to.have.been.calledWith(2);
      });
    });
  });

  describe('when `slides-per-page` attribute is provided', () => {
    it('should show multiple slides at a given time', async () => {
      // Arrange
      const el = await fixture<SdCarousel>(html`
        <sd-carousel slides-per-page="2">
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);

      // Act
      await el.updateComplete;

      // Assert
      expect(el.scrollContainer.style.getPropertyValue('--slides-per-page').trim()).to.be.equal('2');
    });
  });

  describe('when `slides-per-move` attribute is provided', () => {
    it('should set the granularity of snapping', async () => {
      // Arrange
      const expectedSnapGranularity = 2;
      const el = await fixture<SdCarousel>(html`
        <sd-carousel slides-per-move="${expectedSnapGranularity}">
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
          <sd-carousel-item>Node 4</sd-carousel-item>
        </sd-carousel>
      `);

      // Act
      await el.updateComplete;

      // Assert
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i] as HTMLElement;

        if (i % expectedSnapGranularity === 0) {
          expect(child.style.getPropertyValue('scroll-snap-align')).to.be.equal('');
        } else {
          expect(child.style.getPropertyValue('scroll-snap-align')).to.be.equal('none');
        }
      }
    });
  });

  describe('Navigation controls', () => {
    describe('when the user clicks the next button', () => {
      it('should scroll to the next slide', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        const nextButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--next')!;
        sinon.stub(el, 'next');
        await el.updateComplete;
        // Act
        await clickOnElement(nextButton);
        await el.updateComplete;
        // Assert
        expect(el.next).to.have.been.calledOnce;
      });
      describe('and carousel is positioned on the last slide', () => {
        it('should not scroll', async () => {
          // Arrange
          const el = await fixture<SdCarousel>(html`
            <sd-carousel>
              <sd-carousel-item>Node 1</sd-carousel-item>
              <sd-carousel-item>Node 2</sd-carousel-item>
              <sd-carousel-item>Node 3</sd-carousel-item>
            </sd-carousel>
          `);
          const nextButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--next')!;
          sinon.stub(el, 'next');
          el.goToSlide(2, 'auto');
          await oneEvent(el.scrollContainer, 'scrollend');
          await el.updateComplete;
          // Act
          await clickOnElement(nextButton);
          await el.updateComplete;
          // Assert
          expect(nextButton).to.have.attribute('aria-disabled', 'true');
          expect(el.next).not.to.have.been.called;
        });
        describe('and `loop` attribute is provided', () => {
          it('should scroll to the first slide', async () => {
            // Arrange
            const el = await fixture<SdCarousel>(html`
              <sd-carousel variant="dot" loop>
                <sd-carousel-item>Node 1</sd-carousel-item>
                <sd-carousel-item>Node 2</sd-carousel-item>
                <sd-carousel-item>Node 3</sd-carousel-item>
              </sd-carousel>
            `);
            const nextButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--next')!;
            el.goToSlide(2, 'auto');
            await oneEvent(el.scrollContainer, 'scrollend');
            await el.updateComplete;
            // Act
            await clickOnElement(nextButton);
            // wait first scroll to clone
            await oneEvent(el.scrollContainer, 'scrollend');
            // wait scroll to actual item
            await oneEvent(el.scrollContainer, 'scrollend');
            // Assert
            expect(nextButton).to.have.attribute('aria-disabled', 'false');
            expect(el.activeSlide).to.be.equal(0);
          });
        });
      });
    });
  });

  describe('and clicks the previous button', () => {
    it('should scroll to the previous slide', async () => {
      // Arrange
      const el = await fixture<SdCarousel>(html`
        <sd-carousel>
          <sd-carousel-item>Node 1</sd-carousel-item>
          <sd-carousel-item>Node 2</sd-carousel-item>
          <sd-carousel-item>Node 3</sd-carousel-item>
        </sd-carousel>
      `);

      // Go to the second slide so that the previous button will be enabled
      el.goToSlide(1, 'auto');
      await oneEvent(el.scrollContainer, 'scrollend');
      await el.updateComplete;

      const previousButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--previous')!;
      sinon.stub(el, 'previous');

      await el.updateComplete;

      // Act
      await clickOnElement(previousButton);
      await el.updateComplete;

      // Assert
      expect(el.previous).to.have.been.calledOnce;
    });

    describe('and carousel is positioned on the first slide', () => {
      it('should not scroll', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        const previousButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--previous')!;
        sinon.stub(el, 'previous');
        await el.updateComplete;
        // Act
        await clickOnElement(previousButton);
        await el.updateComplete;
        // Assert
        expect(previousButton).to.have.attribute('aria-disabled', 'true');
        expect(el.previous).not.to.have.been.called;
      });
      describe('and `loop` attribute is provided', () => {
        it('should scroll to the last slide', async () => {
          // Arrange
          const el = await fixture<SdCarousel>(html`
            <sd-carousel loop>
              <sd-carousel-item>Node 1</sd-carousel-item>
              <sd-carousel-item>Node 2</sd-carousel-item>
              <sd-carousel-item>Node 3</sd-carousel-item>
            </sd-carousel>
          `);
          const previousButton: HTMLElement = el.shadowRoot!.querySelector('#carousel__navigation-button--previous')!;
          await el.updateComplete;
          // Act
          await clickOnElement(previousButton);
          // wait first scroll to clone
          await oneEvent(el.scrollContainer, 'scrollend');
          // wait scroll to actual item
          await oneEvent(el.scrollContainer, 'scrollend');
          // Assert
          expect(previousButton).to.have.attribute('aria-disabled', 'false');
          expect(el.activeSlide).to.be.equal(2);
        });
      });
    });
  });

  describe('API', () => {
    describe('#next', () => {
      it('should scroll the carousel to the next slide', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        sinon.stub(el, 'goToSlide');
        await el.updateComplete;

        // Act
        el.next();

        expect(el.goToSlide).to.have.been.calledWith(1);
      });
    });

    describe('#previous', () => {
      it('should scroll the carousel to the previous slide', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        sinon.stub(el, 'goToSlide');
        await el.updateComplete;

        // Act
        el.previous();

        expect(el.goToSlide).to.have.been.calledWith(-1);
      });
    });

    describe('#goToSlide', () => {
      it('should scroll the carousel to the nth slide', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        await el.updateComplete;

        // Act
        el.goToSlide(2);
        await oneEvent(el.scrollContainer, 'scrollend');
        await el.updateComplete;

        // Assert
        expect(el.activeSlide).to.be.equal(2);
      });
    });
  });

  describe('Accessibility', () => {
    describe('when number `variant` is used', () => {
      it('should pass accessibility tests', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel>
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        const pagination = el.shadowRoot!.querySelector('.carousel__pagination')!;
        const navigation = el.shadowRoot!.querySelector('.carousel__navigation')!;
        await el.updateComplete;

        // Assert
        expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');
        expect(el.scrollContainer).to.have.attribute('aria-atomic', 'true');

        expect(pagination).to.have.attribute('aria-controls', el.scrollContainer.id);
        for (const paginationItem of pagination.querySelectorAll('.carousel__pagination-item')) {
          expect(paginationItem).to.have.attribute('role', 'tab');
          expect(paginationItem).to.have.attribute('aria-selected');
          expect(paginationItem).to.have.attribute('aria-label');
        }

        for (const navigationItem of navigation.querySelectorAll('.carousel__navigation-item')) {
          expect(navigationItem).to.have.attribute('aria-controls', el.scrollContainer.id);
          expect(navigationItem).to.have.attribute('aria-disabled');
          expect(navigationItem).to.have.attribute('aria-label');
        }

        await expect(el).to.be.accessible();
      });
    });

    describe('when dot `variant` is used', () => {
      it('should pass accessibility tests', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel variant="dot">
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);
        const pagination = el.shadowRoot!.querySelector('.carousel__pagination')!;
        const navigation = el.shadowRoot!.querySelector('.carousel__navigation')!;
        await el.updateComplete;

        // Assert
        expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');
        expect(el.scrollContainer).to.have.attribute('aria-atomic', 'true');

        expect(pagination).to.have.attribute('role', 'tablist');
        expect(pagination).to.have.attribute('aria-controls', el.scrollContainer.id);
        for (const paginationItem of pagination.querySelectorAll('.carousel__pagination-item')) {
          expect(paginationItem).to.have.attribute('role', 'tab');
          expect(paginationItem).to.have.attribute('aria-selected');
          expect(paginationItem).to.have.attribute('aria-label');
        }

        for (const navigationItem of navigation.querySelectorAll('.carousel__navigation-item')) {
          expect(navigationItem).to.have.attribute('aria-controls', el.scrollContainer.id);
          expect(navigationItem).to.have.attribute('aria-disabled');
          expect(navigationItem).to.have.attribute('aria-label');
        }

        await expect(el).to.be.accessible();
      });
    });

    describe('when scrolling', () => {
      it('should update aria-busy attribute', async () => {
        // Arrange
        const el = await fixture<SdCarousel>(html`
          <sd-carousel variant="dot">
            <sd-carousel-item>Node 1</sd-carousel-item>
            <sd-carousel-item>Node 2</sd-carousel-item>
            <sd-carousel-item>Node 3</sd-carousel-item>
          </sd-carousel>
        `);

        await el.updateComplete;

        expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');

        // Act
        el.goToSlide(2, 'smooth');
        await oneEvent(el.scrollContainer, 'scroll');
        await el.updateComplete;
        // Assert
        expect(el.scrollContainer).to.have.attribute('aria-busy', 'true');

        await oneEvent(el.scrollContainer, 'scrollend');
        await el.updateComplete;

        // It takes a moment for the scrollend event to be fired.
        await aTimeout(100);

        expect(el.scrollContainer).to.have.attribute('aria-busy', 'false');
      });
    });
  });

  describe('getPageCount', () => {
    it('should return the correct page count when totalSlides is divisible by slidesPerPage', () => {
      // Arrange
      const totalSlides = 10;
      const slidesPerPage = 2;
      const slidesPerMove = 1;

      // Act
      const pageCount = SdCarousel.getPageCount(totalSlides, slidesPerPage, slidesPerMove);

      // Assert
      expect(pageCount).to.equal(9);
    });

    it('should return the correct page count when totalSlides is not divisible by slidesPerPage', () => {
      // Arrange
      const totalSlides = 11;
      const slidesPerPage = 3;
      const slidesPerMove = 2;

      // Act
      const pageCount = SdCarousel.getPageCount(totalSlides, slidesPerPage, slidesPerMove);

      // Assert
      expect(pageCount).to.equal(5);
    });

    it('should return 1 when totalSlides is less than or equal to slidesPerPage', () => {
      // Arrange
      const totalSlides = 3;
      const slidesPerPage = 5;
      const slidesPerMove = 1;

      // Act
      const pageCount = SdCarousel.getPageCount(totalSlides, slidesPerPage, slidesPerMove);

      // Assert
      expect(pageCount).to.equal(1);
    });
  });

  describe('getCurrentPage', () => {
    it('should return the correct current page when the active slide is the first slide', () => {
      // Arrange
      const totalSlides = 5;
      const activeSlide = 0;
      const slidesPerPage = 2;
      const slidesPerMove = 1;

      // Act
      const currentPage = SdCarousel.getCurrentPage(totalSlides, activeSlide, slidesPerPage, slidesPerMove);

      // Assert
      expect(currentPage).to.equal(1);
    });

    it('should return the correct current page when the active slide is in the middle of the carousel', () => {
      // Arrange
      const totalSlides = 5;
      const activeSlide = 2;
      const slidesPerPage = 2;
      const slidesPerMove = 1;

      // Act
      const currentPage = SdCarousel.getCurrentPage(totalSlides, activeSlide, slidesPerPage, slidesPerMove);

      // Assert
      expect(currentPage).to.equal(3);
    });

    it('should return the correct current page when the active slide is the last slide', () => {
      // Arrange
      const totalSlides = 5;
      const activeSlide = 4;
      const slidesPerPage = 2;
      const slidesPerMove = 1;

      // Act
      const currentPage = SdCarousel.getCurrentPage(totalSlides, activeSlide, slidesPerPage, slidesPerMove);

      // Assert
      expect(currentPage).to.equal(5);
    });
  });
});
