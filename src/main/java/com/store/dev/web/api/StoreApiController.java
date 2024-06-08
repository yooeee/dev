package com.store.dev.web.api;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.store.dev.dto.AdmDTO;
import com.store.dev.dto.ResponseDTO;
import com.store.dev.dto.SearchDTO;
import com.store.dev.dto.SearchResDTO;
import com.store.dev.dto.StoreDTO;
import com.store.dev.service.StoreService;

import io.github.bonigarcia.wdm.WebDriverManager;
import jakarta.annotation.Resource;





@RestController
@RequestMapping("/api/store")
public class StoreApiController {

    @Resource
    private StoreService storeService;

    @GetMapping("")
    public ResponseDTO searchList(SearchDTO searchDTO) {
        ResponseDTO res = new ResponseDTO();
        SearchResDTO resDTO = new SearchResDTO();

        List<StoreDTO> list = null;
        List<AdmDTO> sdList = null;
        List<AdmDTO> sggList = null;
        int count;

        if (!searchDTO.getType1().equals("my")) {
            list = storeService.selectListStore(searchDTO);
            count = storeService.selectListStoreByCount(searchDTO);
            sdList = storeService.selectListSdCluster(searchDTO);
            sggList = storeService.selectListSggCluster(searchDTO);

        } else {
            list = storeService.selectListStoreByDistance(searchDTO);
            count = storeService.selectListStoreCountByDistance(searchDTO);
        }

        resDTO.setList(list);
        resDTO.setCount(count);

        res.setStatus("success");
        res.setErrCode(null);
        res.setResult(list);
        res.setSdResult(sdList);
        res.setSggResult(sggList);
        res.setResultCnt(count);
        return res;
    }

    @GetMapping("/info")
    public ResponseDTO getMethodName(@RequestParam int seq, @RequestParam String category, @RequestParam String name,
            @RequestParam String doro, @RequestParam String jibeon) throws InterruptedException {
                ResponseDTO res = new ResponseDTO();

                WebDriverManager.chromedriver().setup();
                WebDriver driver = new ChromeDriver();
                JavascriptExecutor js = (JavascriptExecutor) driver;
        
                  // doro와 jibeon 각각에서 첫 세 단어를 추출
                String[] doroParts = doro.split(" ");
                String doroFirstThreeWords = doroParts.length > 2 ? doroParts[0] + " " + doroParts[1] + " " + doroParts[2] : doro;

                WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(2));
        
                // 카카오맵에서 검색하기
                driver.get("https://m.map.kakao.com/actions/searchView?q=" + name + " " + doroFirstThreeWords);

                try {
                    WebElement searchNoneElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".search_none")));
                    if (searchNoneElement != null) {
                        res.setStatus("noResult");
                        driver.quit();
                        return res;
                    }
                } catch (TimeoutException e) {
                }


                WebElement firstResult = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".list_result li")));
                firstResult.click();
        
                // 페이지가 로드될 때까지 대기합니다.
                wait.until(ExpectedConditions.presenceOfElementLocated(By.className("cont_grade")));
        
                // 현재 URL을 가져와 출력합니다.
                String currentUrl = driver.getCurrentUrl();


                  // 카카오 사진 가져오기
                List<WebElement> photoElements = new ArrayList<>();
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".list_photo li a img"))); // 요소가 로드될 때까지 대기
                    photoElements = driver.findElements(By.cssSelector(".list_photo li a img"));
                } catch (NoSuchElementException | TimeoutException e) {
                }
                List<String> photoSrcList = new ArrayList<>();
                for (WebElement element : photoElements) {
                    String src = element.getAttribute("src");
                    if (!src.contains("thumb_s_alpha0.png")) { // 유효한 이미지 필터링
                        photoSrcList.add(src);
                    }
                }
        
                // 블로그 후기 가져오기
                List<WebElement> blogReviewElements = new ArrayList<>();
                try {
                    blogReviewElements = driver.findElements(By.cssSelector(".list_review li"));
                } catch (NoSuchElementException | TimeoutException e) {
                }
                List<Map<String, String>> blogReviewList = new ArrayList<>();
        
                for (WebElement blogReviewElement : blogReviewElements) {
                    Map<String, String> reviewData = new HashMap<>();
                    try {
                        reviewData.put("title", blogReviewElement.findElement(By.cssSelector(".tit_review")).getText());
                        reviewData.put("content", blogReviewElement.findElement(By.cssSelector(".txt_review")).getText());
                        reviewData.put("author", blogReviewElement.findElement(By.cssSelector(".loss_word")).getText());
                        reviewData.put("date", blogReviewElement.findElement(By.cssSelector(".review_date")).getText());
                        reviewData.put("link", blogReviewElement.findElement(By.cssSelector("a.link_review")).getAttribute("href"));
        
                        List<WebElement> photoReviewElements = blogReviewElement.findElements(By.cssSelector(".photo_slider .item_photo img"));
                        List<String> photos = new ArrayList<>();
                        for (WebElement photoElement : photoReviewElements) {
                            photos.add(photoElement.getAttribute("src"));
                        }
                        reviewData.put("photos", String.join(",", photos));
                    } catch (NoSuchElementException e) {
                    }
                    blogReviewList.add(reviewData);
                }
        
           
        
                // 전화번호
                List<WebElement> numberElements = new ArrayList<>();
                try {
                    numberElements = driver.findElements(By.className("num_contact"));
                } catch (NoSuchElementException | TimeoutException e) {
                }
                String numberList = null;
                for (WebElement element : numberElements) {
                    numberList = element.getText();
                }
        
                // 영업시간
        String timeList = null;
        try {
            WebElement timeElement = driver.findElements(By.className("txt_operation")).get(0);
            timeList = timeElement.getText();
        } catch (NoSuchElementException | IndexOutOfBoundsException e) {
        }
        
                Thread.sleep(1000); // 추가 대기 시간을 넣어 안정성을 높임
        
                // 음식메뉴 이동
                driver.get(currentUrl + "#menuInfo");
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.className("info_menu"))); // 요소가 로드될 때까지 대기
                    Thread.sleep(1000); // 페이지가 완전히 로드될 때까지 추가 대기
                } catch (NoSuchElementException | TimeoutException e) {
                }
                // 음식 메뉴 가져오기
                List<WebElement> menuElements = new ArrayList<>();
                try {
                    menuElements = driver.findElements(By.cssSelector(".list_menu .info_menu"));
                } catch (NoSuchElementException | TimeoutException e) {
                }
                List<Map<String, String>> menuList = new ArrayList<>();
                for (WebElement element : menuElements) {
                    Map<String, String> menuData = new HashMap<>();
                    try {
                        menuData.put("name", element.findElement(By.className("name_menu")).getText());
                        menuData.put("price", element.findElement(By.className("price_menu")).getText().trim());
                    } catch (NoSuchElementException e) {
                    }
                    menuList.add(menuData);
                }
        
                // 카카오리뷰 이동
                driver.get(currentUrl + "#comment"); // 리뷰를 가져올 새로운 URL
                try {
                    wait.until(ExpectedConditions.presenceOfElementLocated(By.className("txt_comment"))); // 요소가 로드될 때까지 대기
                } catch (NoSuchElementException | TimeoutException e) {
                }
                Thread.sleep(1000); // 페이지가 완전히 로드될 때까지 추가 대기
        
                List<WebElement> kakaoReviewElements = new ArrayList<>();
                try {
                    kakaoReviewElements = driver.findElements(By.className("inner_grade")); // 각 리뷰 요소를 찾음
                } catch (NoSuchElementException e) {
                }
        
                List<Map<String, String>> kakaoReviewList = new ArrayList<>();
                for (WebElement kakaoReviewElement : kakaoReviewElements) {
                    Map<String, String> reviewData = new HashMap<>();
                    try {
                        reviewData.put("username", kakaoReviewElement.findElement(By.className("name_user")).getText());
                        reviewData.put("review", kakaoReviewElement.findElement(By.className("txt_comment")).getText());
                        reviewData.put("date", kakaoReviewElement.findElement(By.className("time_write")).getText());
                        kakaoReviewList.add(reviewData);
                    } catch (NoSuchElementException e) {
                    }
                }

                // 카카오 전체 평점 가져오기
                String overallRating = null;
                try {
                    WebElement overallRatingElement = driver.findElement(By.cssSelector(".grade_star.size_m .num_rate"));
                    overallRating = overallRatingElement.getText();
                } catch (NoSuchElementException e) {
                }
        
        
                // 결과를 맵에 저장
                Map<String, Object> result = new HashMap<>();
                if (!menuList.isEmpty()) {
                    result.put("menuList", menuList);
                }
                if (!kakaoReviewList.isEmpty()) {
                    result.put("kakaoReviewList", kakaoReviewList);
                }
                if (!photoSrcList.isEmpty()) {
                    result.put("photoSrcList", photoSrcList); // 사진 href 리스트를 결과에 추가
                }
                if (numberList != null) {
                    result.put("numberList", numberList);
                }
                if (timeList != null) {
                    result.put("timeList", timeList);
                }
                if (overallRating != null) {
                    result.put("overallRating", overallRating);
                }
        
                if (!blogReviewList.isEmpty()) {
                    result.put("blogReviewList", blogReviewList);
                }
        
                res.setStatus("success");
                res.setResult(result);
                driver.quit();
                return res;

    }

}
