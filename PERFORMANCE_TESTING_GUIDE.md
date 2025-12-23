# Performance Testing Guide

## Quick Start

### 1. Build the Production Version
```bash
npm run build
```

### 2. Start the Production Server
```bash
npm start
```

### 3. Test with Google PageSpeed Insights

#### Option A: Using PageSpeed Insights Website
1. Go to: https://pagespeed.web.dev/
2. Enter your deployed URL or localhost URL (requires public access)
3. Click "Analyze"
4. Wait for results

#### Option B: Using Lighthouse in Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Mobile (test mobile first!)
   - ✅ Clear storage
   - ✅ Simulated throttling
4. Click "Analyze page load"

#### Option C: Using Lighthouse CLI
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view --preset=desktop
lighthouse http://localhost:3000 --view --preset=mobile
```

## What to Check

### Core Web Vitals (Mobile)
- **LCP**: Should be < 1.8s (GREEN)
- **INP**: Should be < 200ms (GREEN)
- **CLS**: Should be < 0.1 (GREEN)
- **FCP**: Should be < 1.2s (GREEN)
- **Speed Index**: Should be < 2.5s (GREEN)

### Performance Score
- **Target**: 100% (or 90-100 range)
- **Mobile**: Primary focus
- **Desktop**: Should also be 100%

### Opportunities
- Should show minimal or no opportunities
- Bundle size should be optimized
- Images should be optimized
- No render-blocking resources

### Diagnostics
- Minimal main-thread work
- Fast server response times
- Efficient cache policy
- Minimal DOM size

## Optimization Checklist

### ✅ Completed Optimizations
- [x] Next.js configuration optimized
- [x] Image optimization enabled
- [x] Code splitting implemented
- [x] Bundle size reduced
- [x] Font loading optimized
- [x] CSS optimized
- [x] Hero component optimized for LCP
- [x] Dynamic imports for below-the-fold content
- [x] Caching headers configured
- [x] Compression enabled
- [x] Resource hints added
- [x] Reduced motion support

### 📊 Expected Metrics

#### Mobile (3G Network Simulation)
- Performance: 90-100
- LCP: 1.2-1.8s
- INP: 50-150ms
- CLS: 0-0.05
- FCP: 0.8-1.2s
- Speed Index: 1.5-2.5s

#### Desktop (Fast Network)
- Performance: 95-100
- LCP: 0.5-1.0s
- INP: 20-80ms
- CLS: 0-0.03
- FCP: 0.3-0.8s
- Speed Index: 0.8-1.5s

## Troubleshooting

### If Performance Score is Below 90

#### Check LCP
- Is Hero component rendering without JavaScript?
- Are fonts loading properly?
- Are there any render-blocking resources?

#### Check INP
- Is JavaScript bundle too large?
- Are there long-running tasks?
- Is code splitting working?

#### Check CLS
- Are fonts causing layout shifts?
- Are images sized properly?
- Are dynamic components loading correctly?

### Common Issues

1. **Large Bundle Size**
   - Check if dynamic imports are working
   - Verify modularized imports
   - Check webpack bundle analyzer

2. **Slow LCP**
   - Verify Hero has no animations on load
   - Check font loading strategy
   - Ensure no render-blocking CSS

3. **High INP**
   - Reduce JavaScript execution time
   - Optimize event handlers
   - Check for long tasks

4. **Layout Shifts (CLS)**
   - Add dimensions to images
   - Use font fallbacks
   - Add loading placeholders

## Deployment Checklist

### Before Deploying
- [ ] Run production build locally
- [ ] Test with Lighthouse
- [ ] Verify all Core Web Vitals are green
- [ ] Check bundle sizes
- [ ] Test on slow network (3G)
- [ ] Test on mobile device

### After Deploying
- [ ] Run PageSpeed Insights on live URL
- [ ] Monitor Vercel Speed Insights
- [ ] Check real user metrics
- [ ] Set up performance monitoring
- [ ] Configure performance budgets

## Performance Monitoring

### Vercel Speed Insights
Already integrated in the app. Check:
- Real user metrics
- Core Web Vitals
- Page load times
- Geographic distribution

### Lighthouse CI
Set up for continuous monitoring:
```bash
npm install -g @lhci/cli
lhci autorun
```

### Performance Budgets
Recommended budgets:
- JavaScript: < 200KB
- CSS: < 50KB
- Images: < 500KB (total)
- Fonts: < 100KB
- LCP: < 1.8s
- INP: < 200ms
- CLS: < 0.1

## Next Steps

1. **Build**: `npm run build`
2. **Start**: `npm start`
3. **Test**: Run Lighthouse or PageSpeed Insights
4. **Deploy**: Deploy to production
5. **Monitor**: Track real user metrics
6. **Iterate**: Continue optimizing based on data

## Support

For issues or questions:
1. Check PERFORMANCE_OPTIMIZATION_REPORT.md
2. Review Next.js performance docs
3. Check Google Web Vitals guide
4. Use Chrome DevTools Performance panel

---

**Goal**: Achieve and maintain 100% Mobile Performance Score
**Status**: Ready for testing
**Last Updated**: 2025-12-23
