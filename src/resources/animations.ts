import { animate, style, transition, trigger } from "@angular/animations";

export const slideInAnimation = trigger('routeAnimations', [
  transition('slideIn <=> *', [
    style({ 
      opacity: 0, 
      transform: 'translateY(30px) scale(0.95)'
    }),
    animate(
      '500ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({ 
        opacity: 1, 
        transform: 'translateY(0) scale(1)'
      })
    )
  ])
]);