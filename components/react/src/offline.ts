import React from 'react';
import type { IconifyIcon, IconifyJSON } from '@iconify/types';
import type { IconifyIconSize } from '@iconify/utils/lib/customisations/defaults';
import { defaultIconProps } from '@iconify/utils/lib/icon/defaults';
import { parseIconSet } from '@iconify/utils/lib/icon-set/parse';
import { quicklyValidateIconSet } from '@iconify/utils/lib/icon-set/validate-basic';
import type {
	IconifyIconCustomisations,
	IconifyIconProps,
	IconifyRenderMode,
	IconProps,
	IconRef,
} from './props';
import { render } from './render';

/**
 * Export stuff from props.ts
 */
export { IconifyIconCustomisations, IconifyIconProps, IconProps };

/**
 * Export types that could be used in component
 */
export { IconifyIcon, IconifyJSON, IconifyIconSize, IconifyRenderMode };

/**
 * Storage for icons referred by name
 */
const storage: Record<string, IconifyIcon> = Object.create(null);

/**
 * Generate icon
 */
function component(
	props: IconProps,
	inline: boolean,
	ref?: React.ForwardedRef<IconRef>
): JSX.Element {
	// Split properties
	const propsIcon = props.icon;
	const icon =
		typeof propsIcon === 'string'
			? storage[propsIcon]
			: typeof propsIcon === 'object'
			? propsIcon
			: null;

	// Validate icon object
	if (
		icon === null ||
		typeof icon !== 'object' ||
		typeof icon.body !== 'string'
	) {
		return props.children
			? (props.children as JSX.Element)
			: React.createElement('span', {});
	}

	// Valid icon: render it
	return render(
		{
			...defaultIconProps,
			...icon,
		},
		props,
		inline,
		ref as IconRef
	);
}

/**
 * Block icon
 *
 * @param props - Component properties
 */
export const Icon = React.forwardRef<IconRef, IconProps>(function Icon(
	props,
	ref
) {
	return component(props, false, ref);
});

/**
 * Inline icon (has negative verticalAlign that makes it behave like icon font)
 *
 * @param props - Component properties
 */
export const InlineIcon = React.forwardRef<IconRef, IconProps>(
	function InlineIcon(props, ref) {
		return component(props, true, ref);
	}
);

/**
 * Add icon to storage, allowing to call it by name
 *
 * @param name
 * @param data
 */
export function addIcon(name: string, data: IconifyIcon): void {
	storage[name] = data;
}

/**
 * Add collection to storage, allowing to call icons by name
 *
 * @param data Icon set
 * @param prefix Optional prefix to add to icon names, true (default) if prefix from icon set should be used.
 */
export function addCollection(
	data: IconifyJSON,
	prefix?: string | boolean
): void {
	const iconPrefix: string =
		typeof prefix === 'string'
			? prefix
			: prefix !== false && typeof data.prefix === 'string'
			? data.prefix + ':'
			: '';

	quicklyValidateIconSet(data) &&
		parseIconSet(data, (name, icon) => {
			if (icon) {
				storage[iconPrefix + name] = icon;
			}
		});
}
