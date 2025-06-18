import {
    	Toast,
    	ToastClose,
    	ToastDescription,
    	ToastProvider,
    	ToastTitle,
    	ToastViewport,
    } from '@/components/ui/toast';
    import { useToast } from '@/components/ui/use-toast';
    import React from 'react';

    export function Toaster({ position, ...props }) {
    	const { toasts } = useToast();

    	return (
    		<ToastProvider>
    			{toasts.map(({ id, title, description, action, ...toastProps }) => {
    				return (
    					<Toast key={id} {...toastProps}>
    						<div className="grid gap-1">
    							{title && <ToastTitle>{title}</ToastTitle>}
    							{description && (
    								<ToastDescription>{description}</ToastDescription>
    							)}
    						</div>
    						{action}
    						<ToastClose />
    					</Toast>
    				);
    			})}
    			<ToastViewport className={position === 'bottom-center' ? 'sm:bottom-0 sm:top-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2' : ''} />
    		</ToastProvider>
    	);
    }
