/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/svelte';
import Icon from '../../dist/offline';

const iconData = {
	body: '<path d="M4 19h16v2H4zm5-4h11v2H9zm-5-4h16v2H4zm0-8h16v2H4zm5 4h11v2H9z" fill="currentColor"/>',
	width: 24,
	height: 24,
};

describe('Dimensions', () => {
	test('height', () => {
		const component = render(Icon, { icon: iconData, height: '48' });
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('48');
		expect(node.getAttribute('width')).toBe('48');
	});

	test('width and height', () => {
		const component = render(Icon, {
			icon: iconData,
			// Mixing numbers and strings
			width: 32,
			height: '48',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('48');
		expect(node.getAttribute('width')).toBe('32');
	});

	test('auto', () => {
		const component = render(Icon, {
			icon: iconData,
			height: 'auto',
		});
		const node = component.container.querySelector('svg')!;
		expect(node.getAttribute('height')).toBe('24');
		expect(node.getAttribute('width')).toBe('24');
	});
});
