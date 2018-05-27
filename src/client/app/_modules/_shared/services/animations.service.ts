import { trigger, animate, style, group, query, transition } from '@angular/animations';

export function fadeAnimation() {
  return trigger('routerTransition', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'absolute', width: '100%', height: '100%' })
        , { optional: true }),
      group([
        query(':leave', [
          style({ opacity: 1 }), animate('150ms', style({ opacity: 0 }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }), animate('150ms', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]);
}

export function slideToRight() {
  return trigger('routerTransition', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'absolute', width: '100%' })
        , { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(-100%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
        ], { optional: true })
      ])
    ])
  ]);
}

export function slideToLeft() {
  return trigger('routerTransition', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'absolute', width: '100%' })
        , { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateX(0%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true })
      ])
    ])
  ]);
}

export function slideToBottom() {
  return trigger('routerTransition', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'absolute', width: '100%', height: '100%' })
        , { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateY(-100%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateY(0%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
        ], { optional: true })
      ])
    ])
  ]);
}

export function slideToTop() {
  return trigger('routerTransition', [
    transition('* <=> *', [
      query(':enter, :leave', style({ position: 'absolute', width: '100%', height: '100%' })
        , { optional: true }),
      group([
        query(':enter', [
          style({ transform: 'translateY(100%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform: 'translateY(0%)' }),
          animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
        ], { optional: true })
      ])
    ])
  ]);
}
